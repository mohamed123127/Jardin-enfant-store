// src/database/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { AttributeEntity } from 'src/modules/inventory/attributes/entities/attribute.entity';
import attributeList from '../mock-data/attributes.json';


export default setSeederFactory(AttributeEntity, () => {
    const attribute = new AttributeEntity();
    attribute.name = faker.helpers.arrayElement(attributeList);
    return attribute;
});

