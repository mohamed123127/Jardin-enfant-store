// barcode.service.ts
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createHmac } from 'crypto';
import { ProductEntity } from 'src/modules/inventory/products/entities/product.entity';
import { TenantRepository } from 'src/common/base/repositories/tenant-repository';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';
import { InjectTenantRepository } from 'src/common/decorators/tenant-repo.decorator';

// ff3 ships as plain JS with no bundled TypeScript types (module.exports = FF3Cipher),
// so require it and, ideally, add a small .d.ts declaration for it in your project.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FF3Cipher = require('ff3/lib/FF3Cipher');

@Injectable()
export class BarcodeGenerator {
    /** Exactly 8 decimal digits -> domain is exactly 10^8, no modulo/folding needed */
    private readonly BARCODE_LENGTH = 8;
    private readonly MAX_SEQUENCE = 10 ** this.BARCODE_LENGTH - 1; // 99_999_999

    private readonly barcodeGeneratorKey = "h9319yF2t17Fp5W31k3B9bX00D89";

    constructor(
        @InjectTenantRepository(ProductEntity) private readonly productRepository: TenantRepository<ProductEntity>,
        private readonly dataSource: DataSource) {
    }

    /**
     * Derives a per-tenant key from one master secret (HMAC-SHA256).
     * FF3Cipher requires a hex-encoded key of 16/24/32 bytes (128/192/256-bit).
     * A full SHA-256 hex digest is 64 hex chars = 32 bytes = AES-256. Perfect fit, no truncation needed.
     */
    private getTenantKey(tenantId: string): string {
        return createHmac('sha256', this.barcodeGeneratorKey!)
            .update(`key:${tenantId}`)
            .digest('hex'); // 64 hex chars -> 256-bit key
    }

    /**
     * Derives a per-tenant tweak (not secret, but must be deterministic per tenant/key).
     * FF3-1 tweak must be 7 bytes = 14 hex chars.
     */
    private getTenantTweak(tenantId: string): string {
        return createHmac('sha256', this.barcodeGeneratorKey!)
            .update(`tweak:${tenantId}`)
            .digest('hex')
            .slice(0, 14); // 14 hex chars = 7 bytes = FF3-1 tweak length
    }

    private getCipher(tenantId: string) {
        const key = this.getTenantKey(tenantId);
        const tweak = this.getTenantTweak(tenantId);
        return new FF3Cipher(key, tweak, 10); // radix 10 -> pure decimal domain
    }

    /** Atomically gets the next per-tenant sequence number */
    private async getNextTenantSequence(tenantId: string): Promise<number> {
        const result = await this.dataSource.query(
            `
      INSERT INTO tenant_barcode_sequence (tenant_id, last_value)
      VALUES ($1, 1)
      ON CONFLICT (tenant_id)
      DO UPDATE SET last_value = tenant_barcode_sequence.last_value + 1
      RETURNING last_value;
      `,
            [tenantId],
        );

        const seq = Number(result[0].last_value);
        if (seq > this.MAX_SEQUENCE) {
            throw new Error(`Tenant ${tenantId} exceeded barcode capacity`);
        }
        return seq;
    }

    /** Generates a unique, obfuscated 8-digit barcode for a tenant */
    async generateBarcode(tenantId: string): Promise<string> {
        const MAX_RETRIES = 10;
        let barcode = "";
        let isUnique = false;
        let attempts = 0;
        do {
            attempts++;
            const seq = await this.getNextTenantSequence(tenantId);
            const cipher = this.getCipher(tenantId);

            // FF3 operates on a fixed-length decimal STRING, not a raw number,
            // so leading zeros are never lost — the input and output are always
            // exactly 8 digits, a true bijection over [0, 10^8).
            const plaintext = seq.toString().padStart(this.BARCODE_LENGTH, '0');
            barcode = cipher.encrypt(plaintext);
            isUnique = await assertUnique(this.productRepository, [
                {
                    field: 'barcode',
                    value: barcode
                }
            ], 'ProductEntity', undefined, true);

            if (!isUnique && attempts >= MAX_RETRIES) {
                //to do: whene we create an email service and our mecanisme to recieve bugs repport 
                // we send an email to khawa tech team to inform that we have a problem in barcode generation for tenant ${tenantId}
                throw new RequestTimeoutException(
                    `BarcodeGenerator: failed to generate a unique barcode for tenant ${tenantId} after ${MAX_RETRIES} attempts`
                );
            }
        } while (!isUnique)
        return barcode;
    }

    /** Recovers the original tenant sequence number, for debugging */
    decodeBarcode(barcode: string, tenantId: string): number {
        const cipher = this.getCipher(tenantId);
        const normalized = barcode.padStart(this.BARCODE_LENGTH, '0');
        const decrypted = cipher.decrypt(normalized);
        return Number(decrypted);
    }
}