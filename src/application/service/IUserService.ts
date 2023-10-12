
import { IUser } from "../entity/User";

interface IUserService {
    create(user: IUser): Promise<IUser>
    getById(id: string): Promise<IUser | null>
    getByEmail(email: string): Promise<IUser | null>
    update(user: IUser): Promise<IUser>
}

export { IUserService }