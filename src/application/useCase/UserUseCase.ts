import { IUserService } from "../service/IUserService";
import { IUser, UserData, User } from "../entity/User";

import { AppError } from "../../message/Errors";
import { IEncryptor } from "../../utils/Encryptor";

export type CreateUserRequest = Pick<UserData, "name" | "email" | "password">
export type UpdateUserRequest = Pick<IUser, "id" | "name" | "email">
export type UserResponse = Omit<IUser, "deletedAt" | "password">

export class UserUseCase {
    constructor(
        private readonly userService: IUserService,
        private readonly encryptor: IEncryptor
    ) { }

    protected static parseUser(user: IUser): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    async create({ name, email, password }: CreateUserRequest): Promise<UserResponse> {
        const user = await this.userService.getByEmail(email)
        if (user) {
            AppError.throw({typeErr: "emailOrPasswordAlreadyExists"})
        }
        const hashedPassword = this.encryptor.hash(password)
        const userResponse = await this.userService.create(new User({
            name,
            email,
            password: hashedPassword
        }))
        return UserUseCase.parseUser(userResponse)
    }

    async update({ id, name, email }: UpdateUserRequest): Promise<UserResponse> {
        const userFounded = await this.userService.getById(id)
        if (!userFounded) {
            AppError.throw({typeErr: "userNotFound"})
        }
        const user = new User({ name, email, password: userFounded.password })
        const updatedUser = await this.userService.update({
            ...userFounded,
            name: user.name,
            email: user.email,
            updatedAt: new Date(),
        })
        return UserUseCase.parseUser(updatedUser)
    }

    async getById(id: string): Promise<IUser> {
        const userFounded = await this.userService.getById(id)
        if (!userFounded) {
            AppError.throw({typeErr: "userNotFound"})
        }
        return userFounded
    }

    async getByEmail(email: string): Promise<IUser> {
        const userFounded = await this.userService.getByEmail(email)
        if (!userFounded) {
            AppError.throw({typeErr: "userNotFound"})
        }
        return userFounded
    }
}