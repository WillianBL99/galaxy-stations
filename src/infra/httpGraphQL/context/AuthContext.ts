import jwt from 'jsonwebtoken';
import { IUserController } from '../../../application/controller/UserController'
import { BaseContext } from '@apollo/server'
import { IUser } from '../../../application/entity/User';
import { AuthConfig } from '../../../config/Config';
import { AppError } from '../../../message/Errors';


export type TokenResponse = {
    token: string,
    user: Pick<IUser, "name" | "email">
}
export type ContextData = { userId: string }

export class AuthContext {
    constructor(private readonly userController: IUserController) { }

    validateToken = async (token: string) => {
        const fullToken = token || "";

        if (!fullToken) {
            AppError.throw({typeErr: "authenticationTokenRequired"})
        }

        try {
            const [bearer, token] = fullToken.split(" ")
            if (bearer != "Bearer") {
                AppError.throw({typeErr: "tokenNotDefinedCorrectly"})
            }
            const authConfig = new AuthConfig()
            const decoded = jwt.verify(token, authConfig.jwtSecret) as { userId: string };
            const userId = decoded.userId
            const user = await this.userController.getById(userId)
            if (!user) {
                AppError.throw({typeErr: "userNotLogged"})
            }
            return { userId };
        } catch (error) {
            AppError.throw({typeErr: "invalidOrExpiredToken"})
        }
    }
}
