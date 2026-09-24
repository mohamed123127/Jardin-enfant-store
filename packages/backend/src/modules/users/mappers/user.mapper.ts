import { UserResponseDto, UserSummaryDto } from "@aio/shared";
import { UserEntity } from "../entities/user.entity";
import { IMapper } from "src/common/interfaces/mapper.interface";

export class UserMapper implements IMapper<UserEntity> {
    toResponseDto(entity: UserEntity): UserResponseDto {
        return {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            role: entity.role,
            isVerified: entity.isVerified,
            tenantId: 1
        } satisfies UserResponseDto
    }

    toSummaryDto(entity: UserEntity): UserSummaryDto {
        return {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            role: entity.role,
            tenantId: 1
        } satisfies UserSummaryDto
    }

    toSummaryDtoList(entities: UserEntity[]): UserSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity)) satisfies UserSummaryDto[]
    }
}