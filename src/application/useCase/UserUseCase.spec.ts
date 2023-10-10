import { UserFactory } from "../../test/factory/UserFactory";
import { beforeEach, describe, it } from "vitest";
import { UserServiceInMemory } from "../../test/in-memory/UserServiceInMemory";
import { UserUseCase } from "./UserUseCase";
import { expect } from "vitest";
import { appErrors } from "../../error/Errors";
import { IEncryptor } from "../utils/Encryptor";

class Encryptor implements IEncryptor {
    hasResult: string
    compareResult: boolean
    constructor() {
        this.hasResult = "encrypted"
        this.compareResult = false
    }
    hash(_data: string): string {
        return this.hasResult
    }
    compare(data: string, encrypted: string): boolean {
        return this.compareResult
    }

}

describe("User use cases", () => {
    describe("create", () => {
        let userService: UserServiceInMemory
        let userUseCase: UserUseCase
        let encryptor: Encryptor
        beforeEach(() => {
            userService = new UserServiceInMemory()
            encryptor = new Encryptor()
            userUseCase = new UserUseCase(userService, encryptor)
        })
        it("should create a new user", async () => {
            const user = UserFactory.getUser()
            const result = await userUseCase.create(user)

            expect(userService.users[0].id).to.equal(result.id)
            expect(userService.users).length(1)
            expect(result.name).to.equal(user.name)
        })
        it("should return an error if the user alread exists", async () => {
            const user = UserFactory.getUser()
            userService.users.push(user)

            await expect(async () => {
                await userUseCase.create({ ...user })
            }).rejects.toThrow(appErrors.emailOrPasswordAlreadyExists)
            expect(userService.users).length(1)
        })
        it("should hash the password", async () => {
            const user = UserFactory.getUser()
            const result = await userUseCase.create(user)

            expect(result.name).to.equal(user.name)
            expect(userService.users[0].password).to.not.equal(user.password)
            expect(userService.users).length(1)
        })
    })
    describe("update", () => {
        let userService: UserServiceInMemory
        let userUseCase: UserUseCase
        let encryptor: Encryptor
        beforeEach(() => {
            userService = new UserServiceInMemory()
            encryptor = new Encryptor()
            userUseCase = new UserUseCase(userService, encryptor)
        })
        it("should update user information", async () => {
            const user = UserFactory.getUser()
            userService.users.push(user)
            const userToUpdate = UserFactory.getUser()

            const result = await userUseCase.update({ ...userToUpdate, id: user.id })
        })
        it("should return an error if the user does not exist", async () => {
            const user = UserFactory.getUser()

            await expect(async () => {
                await userUseCase.update({ ...user })
            }).rejects.toThrow(appErrors.userNotFound)
        })
        it("should update the updatedAt property", async () => {
            const user = UserFactory.getUser()
            userService.users.push(user)
            const userToUpdate = UserFactory.getUser()

            const result = await userUseCase.update({ ...userToUpdate, id: user.id })
            expect(result.id).to.equal(user.id)
            expect(result.name).to.equal(userToUpdate.name)
            expect(result.email).to.equal(userToUpdate.email)
            expect(result.updatedAt).to.not.equal(user.updatedAt)
        })
    })
    describe("getById", () => {
        let userService: UserServiceInMemory
        let userUseCase: UserUseCase
        let encryptor: Encryptor
        beforeEach(() => {
            userService = new UserServiceInMemory()
            encryptor = new Encryptor()
            userUseCase = new UserUseCase(userService, encryptor)
        })
        it("should retrieve a user by their unique ID", async () => {
            const user = UserFactory.getUser()
            userService.users.push(user)

            const result = await userUseCase.getById(user.id)
            expect(result.name)
        })
        it("should return an error if the ID does not exist", async () => {
            const user = UserFactory.getUser()
            await expect(async () => {
                await userUseCase.getById(user.id)
            }).rejects.toThrow(appErrors.userNotFound)
        })
    })
    describe("getByEmail", () => {
        let userService: UserServiceInMemory
        let userUseCase: UserUseCase
        let encryptor: Encryptor
        beforeEach(() => {
            userService = new UserServiceInMemory()
            encryptor = new Encryptor()
            userUseCase = new UserUseCase(userService, encryptor)
        })
        it("should retrieve a user by their email address", async () => {
            const user = UserFactory.getUser()
            userService.users.push(user)

            const result = await userUseCase.getByEmail(user.email)
            expect(result.name)
        })
        it("should return an error if the email does not exist", async () => {
            const user = UserFactory.getUser()
            await expect(async () => {
                await userUseCase.getByEmail(user.email)
            }).rejects.toThrow(appErrors.userNotFound)
        })
    })
})