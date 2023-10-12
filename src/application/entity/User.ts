import { randomUUID } from "crypto"

interface IUser extends IBase {
    id: string
    name: string
    email: string
    password: string
}

interface UserData extends BaseData {
    id?: string,
    name: string,
    email: string,
    password: string
}

class User implements IUser {
    readonly id: string
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({id, name, email, password, createdAt, updatedAt, deletedAt}: UserData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.email = email
        this.password = password
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IUser, UserData, User }