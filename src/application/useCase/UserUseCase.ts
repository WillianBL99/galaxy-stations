import { IUserService } from "../service/IUserService";
import { IUser, UserData, User } from "../entity/User";
import { hashSync } from "bcrypt"
import { UUID } from "crypto";
import { appErrors } from "../../error/Errors";
import { IEncryptor } from "../../utils/Encryptor";

type CreateUserRequest = Pick<UserData, "name" | "email" | "password">
type UpdateUserRequest = Pick<IUser, "id" | "name" | "email">
type UserResponse = Omit<IUser, "deletedAt" | "password">

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
            cratedAt: user.cratedAt,
            updatedAt: user.updatedAt
        }
    }

    async create({ name, email, password }: CreateUserRequest): Promise<UserResponse> {
        const user = await this.userService.getByEmail(email)
        if (user) {
            throw new Error(appErrors.emailOrPasswordAlreadyExists)
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
            throw new Error(appErrors.userNotFound)
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

    async getById(id: UUID): Promise<UserResponse> {
        const userFounded = await this.userService.getById(id)
        if (!userFounded) {
            throw new Error(appErrors.userNotFound)
        }
        return userFounded
    }

    async getByEmail(email: string): Promise<UserResponse> {
        const userFounded = await this.userService.getByEmail(email)
        if (!userFounded) {
            throw new Error(appErrors.userNotFound)
        }
        return userFounded
    }
}