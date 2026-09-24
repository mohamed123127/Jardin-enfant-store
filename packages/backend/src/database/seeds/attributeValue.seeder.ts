import { AttributeEntity } from 'src/modules/inventory/attributes/entities/attribute.entity';
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { AttributeValueEntity } from 'src/modules/inventory/attribute-values/entities/attribute-value.entity';
import attributeValues from "../mock-data/attributeValues.json";

export class AttributeValueSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const attributeRepo = dataSource.getRepository(AttributeEntity);
        const valueRepo = dataSource.getRepository(AttributeValueEntity);

        const attributes = await attributeRepo.find();

        for (const attribute of attributes) {
            const values = attributeValues[attribute.name];

            if (!values) continue;

            for (const value of values) {
                await valueRepo.save({
                    value,
                    attributeId: attribute.id,
                });
            }
        }
    }
}