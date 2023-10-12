import { TokenResponse } from "../../infra/httpGraphQL/context/AuthContext"
import { IUser } from "../entity/User"
import { CreateUserRequest, UserResponse, UserUseCase } from "../useCase/UserUseCase"

type LoginUserData = Pick<IUser, "email" | "password">

export interface IUserController {
    register(registerData: CreateUserRequest): Promise<UserResponse>
    login(loginData: LoginUserData): Promise<TokenResponse>
    getById(id: string): Promise<UserResponse>
}

export class UserController implements IUserController {
    constructor(private readonly userUseCase: UserUseCase) { }

    async register({ name, email, password }: CreateUserRequest): Promise<UserResponse> {
        return this.userUseCase.create({ name, email, password })
    }

    login(loginData: LoginUserData): Promise<TokenResponse> {
        throw new Error("Method not implemented.")
    }
    
    async getById(id: string): Promise<UserResponse> {
        return await this.userUseCase.getById(id)
    }
}