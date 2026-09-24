// migrations/xxxx-create-tenant-barcode-sequence.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantBarcodeSequence1721676646538
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE tenant_barcode_sequence (
        tenant_id   VARCHAR(64) PRIMARY KEY,
        last_value  BIGINT NOT NULL DEFAULT 0
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tenant_barcode_sequence;`);
    }
}