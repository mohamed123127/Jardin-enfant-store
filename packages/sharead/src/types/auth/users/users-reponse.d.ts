export type UserResponseDto = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    tenantId: number;
};
export type UserSummaryDto = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    tenantId: number;
};
