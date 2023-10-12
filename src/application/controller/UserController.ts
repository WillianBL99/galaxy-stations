import { TokenResponse } from "../../infra/httpGraphQL/context/AuthContext"
import { IUser } from "../entity/User"
import { UserResponse, UserUseCase } from "../useCase/UserUseCase"

type LoginUserData = Pick<IUser, "email" | "password">

export interface IUserController {
    login(loginData: LoginUserData): Promise<TokenResponse>
    getById(id: string): Promise<UserResponse>
}

export class UserController implements IUserController {
    constructor(private readonly userUseCase: UserUseCase) { }

    login(loginData: LoginUserData): Promise<TokenResponse> {
        throw new Error("Method not implemented.")
    }
    async getById(id: string): Promise<UserResponse> {
        return await this.userUseCase.getById(id)
    }
}