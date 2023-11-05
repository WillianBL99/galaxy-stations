import { User, PrismaClient } from "@prisma/client";
import { IUser } from "../../../application/entity/User";
import { IUserService } from "../../../application/service/IUserService";
import { AppError } from "../../../message/Errors";


export class UserPrismaService implements IUserService {
    constructor(private readonly prisma: PrismaClient) { }

    private parserData(raw: User): IUser {
        return {
            id: raw.id,
            name: raw.name,
            email: raw.email,
            password: raw.password,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
            deletedAt: raw.deletedAt ?? undefined,
        }
    }

    private parseRaw(data: IUser): User {
        return {
            ...data,
            updatedAt: data.updatedAt ?? null,
            deletedAt: data.deletedAt ?? null
        }
    }

    async create(user: IUser): Promise<IUser> {
        try {
            const createdUser = await this.prisma.user.create({
                data: this.parseRaw(user)
            })
            return this.parserData(createdUser)
        } catch (error) {
             AppError.throw({typeErr:"internalError", error})
        }
    }

    async getById(id: string): Promise<IUser | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            })
            if (user) {
                return this.parserData(user)
            }
            return null
        } catch (error) {
             AppError.throw({typeErr:"internalError", error})
        }
    }

    async getByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            })
            if (user) {
                return this.parserData(user)
            }
            return null
        } catch (error) {
             AppError.throw({typeErr:"internalError", error})
        }
    }

    async update(user: IUser): Promise<IUser> {
        try {
            const updatedPlanet = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    updatedAt: user.updatedAt,
                }
            })
            return this.parserData(updatedPlanet)
        } catch (error) {
             AppError.throw({typeErr:"internalError", error})
        }
    }
}