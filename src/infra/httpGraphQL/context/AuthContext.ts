import jwt from 'jsonwebtoken';
import { IUserController } from '../../../application/controller/UserController'
import { BaseContext } from '@apollo/server'
import { IUser } from '../../../application/entity/User';


export type TokenResponse = {
    token: string,
    user: Pick<IUser, "name" | "email">
}
export type ContextData = { userId: string }

export class AuthContext {
    constructor(
        private readonly userController: IUserController,
        private readonly secretKey: string
    ) { }

    validateToken = async (token: string) => {
        const fullToken = token || "";

        if (!fullToken) {
            throw new Error("Authentication token is required")
        }

        try {
            const [bearer, token] = fullToken.split(" ")
            if (!bearer) {
                throw new Error("Token is not defined correctly")
            }
            const decoded = jwt.verify(token, this.secretKey) as { id: string };
            const userId = decoded.id
            const user = await this.userController.getById(userId)
            if (!user) {
                throw new Error("User is not logged")
            }
            return { userId };
        } catch (error) {
            throw new Error("Token JWT inválido ou expirado.");
        }
    }
}
