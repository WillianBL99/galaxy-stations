import { App } from "../../../application"
import { AuthContext } from "../context/AuthContext"
import { MutationResolver } from "./Mutation"
import { Planet } from "./Planets"
import { QueryResolver } from "./Query"

export class Resolvers {
    constructor(
        private readonly auth: AuthContext,
        private readonly app: App
    ) {

    }

    content() {
        return {
            Planet,
            Query: new QueryResolver(this.app.controller).content(),
            Mutation: new MutationResolver(this.auth, this.app.controller).content()
        }
    }
}