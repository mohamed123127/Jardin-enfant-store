export type tokenPayload = {
    sub: number;
    tenantId: number;
    role: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}