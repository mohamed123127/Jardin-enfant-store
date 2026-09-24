import { User } from "../auth"

export type BaseApiResponse = {
    success: boolean
    statusCode: number
    message: string
    user: User
}
