import bcrypt from "bcrypt"

export interface IEncryptor {
    hash(data: string): string
    compare(data: string, encrypted: string): boolean
}