import { UserEntity } from "src/users/entities/user.entity";

export interface ApiResponse<T> {
    data: T;
    message: string;
}

export interface AuthResponse {
    user: UserEntity;
    accessToken: string;
    refreshToken: string;
}