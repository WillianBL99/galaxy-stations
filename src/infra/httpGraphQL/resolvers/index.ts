import { App } from "../../../application"
import { MutationResolver } from "./Mutation"
import { Planet } from "./Planets"
import { QueryResolver } from "./Query"

export class Resolvers {
    constructor(
        private readonly app: App
    ) { }
    
    content() {
        return {
            Planet,
            Query: new QueryResolver(this.app.controller).content(),
            Mutation: new MutationResolver(this.app.controller).content()
        }
    }
}