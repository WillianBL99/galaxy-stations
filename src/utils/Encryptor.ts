import bcrypt from "bcrypt"
import { EncryptConfig } from "../config/Config"

export interface IEncryptor {
    hash(data: string): string
    compare(data: string, encrypted: string): boolean
}

export class Encryptor implements IEncryptor {
    constructor(private readonly encConf: EncryptConfig) { }

    hash(data: string): string {
        return bcrypt.hashSync(data, this.encConf.salt)
    }

    compare(data: string, encrypted: string): boolean {
        return bcrypt.compareSync(data, encrypted)
    }
}