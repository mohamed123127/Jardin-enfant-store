import { User } from "./users";
export type LoginPayload = {
    identifier: string;
    password: string;
};
export type AuthResponse = {
    isAuthorized: boolean;
    message: string;
    user: User | null;
    accessToken: string | null;
};
