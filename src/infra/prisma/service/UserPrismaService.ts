import { User, PrismaClient } from "@prisma/client";
import { IUser } from "../../../application/entity/User";
import { IUserService } from "../../../application/service/IUserService";


export class UserPrismaService implements IUserService {
    constructor(private readonly prisma: PrismaClient) { }

    create(user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<IUser | null> {
        throw new Error("Method not implemented.");
    }
    getByEmail(email: string): Promise<IUser | null> {
        throw new Error("Method not implemented.");
    }
    update(user: IUser): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
}