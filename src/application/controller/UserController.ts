import { IUser } from "../entity/User"
import { UserUseCase } from "../useCase/UserUseCase"

type LoginUserData = Pick<IUser, "email" | "password">

export interface IUserController {
    login(loginData: LoginUserData): Promise<IUser>
}

export class UserController implements IUserController {
    constructor(private readonly userUseCase: UserUseCase) {}
    login(loginData: LoginUserData): Promise<IUser> {
        throw new Error("Method not implemented.")
    }
}