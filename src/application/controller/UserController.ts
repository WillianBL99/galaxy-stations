import jwt from "jsonwebtoken"
import { AppConfig, AuthConfig, EncryptConfig } from "../../config/Config"
import { TokenResponse } from "../../infra/httpGraphQL/context/AuthContext"
import { Encryptor, IEncryptor } from "../../utils/Encryptor"
import { IUser } from "../entity/User"
import { CreateUserRequest, UserResponse, UserUseCase } from "../useCase/UserUseCase"

type LoginUserData = Pick<IUser, "email" | "password">

export interface IUserController {
    register(registerData: CreateUserRequest): Promise<UserResponse>
    login(loginData: LoginUserData): Promise<TokenResponse>
    getById(id: string): Promise<UserResponse>
}

export class UserController implements IUserController {
    encryptor: IEncryptor
    appConfig: AppConfig
    constructor(private readonly userUseCase: UserUseCase) {
        this.appConfig = new AppConfig()
        this.encryptor = new Encryptor(new EncryptConfig())
    }

    async register({ name, email, password }: CreateUserRequest): Promise<UserResponse> {
        return this.userUseCase.create({ name, email, password })
    }

    async login({ email, password }: LoginUserData): Promise<TokenResponse> {
        const user = await this.userUseCase.getByEmail(email)
        if (!user) {
            throw new Error(`Wrong email or password`)
        }
        if (!this.encryptor.compare(password, user.password)) {
            throw new Error(`Wrong email or password`)
        }
        const authConfig = new AuthConfig()
        const token = jwt.sign({ userId: user.id }, authConfig.jwtSecret, {
            expiresIn: authConfig.expiresIn
        })
        return {
            token,
            user: { name: user.name, email: user.email }
        }
    }

    async getById(id: string): Promise<UserResponse> {
        return await this.userUseCase.getById(id)
    }
}