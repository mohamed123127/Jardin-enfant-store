import { TenantScopedEntityShape } from "../../common"

export type User = TenantScopedEntityShape & {
    avatar: string;
    firstName: string
    lastName: string
    email: string
    phone: string
    isVerified: boolean
    role: string
    hashedPassword: string
    hashedRefreshToken: string;
}