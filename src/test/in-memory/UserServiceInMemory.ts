import { UUID } from "crypto";
import { IUser } from "../../application/entity/User";
import { IUserService } from "../../application/service/IUserService";

export class UserServiceInMemory implements IUserService {
    users: IUser[]
    constructor() {
        this.users = []
    }
    async create(user: IUser): Promise<IUser> {
        this.users.push(user)
        return user
    }
    async getById(id: UUID): Promise<IUser | null> {
        return this.users.find(user => user.id === id) || null
    }
    async getByEmail(email: string): Promise<IUser | null> {
        return this.users.find(user => user.email === email) || null
    }
    async update(planet: IUser): Promise<IUser> {
        let founded = false
        this.users = this.users.map(u => {
            if (u.id === planet.id) {
                founded = true;
                return planet
            }
            return u
        })

        if (!founded) {
            throw new Error();
        }
        return planet
    }
}