import { UUID } from "crypto";
import { IUser } from "../entity/User";

interface IUserService {
    create(user: IUser): Promise<IUser>
    list(id: UUID): Promise<IUser>
    getById(id: UUID): Promise<IUser>
    getByEmail(email: string): Promise<IUser>
}

export { IUserService }