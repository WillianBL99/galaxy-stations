import { faker } from "@faker-js/faker"
import { IUser, User } from "../../application/entity/User"

export class UserFactory {
    static getUsers(qtd: number): IUser[] {
        const planets: IUser[] = []
        for (let i = 0; i < qtd; i++) {
            planets.push(this.getUser())
        }
        return planets
    }

    static getUser(): IUser {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        return new User({
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }),
            password: faker.internet.password(),
        })
    }
}