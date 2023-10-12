
import { IUser } from "../entity/User";

export interface AuthResponse {
    token: string;
}

export interface IAuthService {
    auth(user: IUser): AuthResponse
}