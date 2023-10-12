export type TokenData = {
    token: string
}

export interface IAuthMiddleware {
    validateToken({ token }: TokenData): boolean
}