import { Column, Entity, OneToMany } from "typeorm";
import { User } from "@aio/shared";
import { TenantScopedEntity } from "../../../common/entities/tenantScoped.entity";

@Entity('users')
export class UserEntity extends TenantScopedEntity implements User {
    @Column({ nullable: true })
    avatar: string;

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    phone: string

    @Column({ default: false })
    isVerified: boolean

    @Column()
    role: string

    @Column()
    hashedPassword: string

    @Column({ nullable: true })
    hashedRefreshToken: string;
}