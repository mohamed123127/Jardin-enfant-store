import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// auth/guards/refresh-jwt-auth.guard.ts
@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') { }