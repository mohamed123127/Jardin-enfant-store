import { ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityShape } from "@aio/shared";

export abstract class BaseEntity implements ObjectLiteral, BaseEntityShape {
    @PrimaryGeneratedColumn()
    id!: number;
}