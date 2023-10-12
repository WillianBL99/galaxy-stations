import { App } from "../../../application"
import { Planet } from "./Planets"
import { QueryResolver } from "./Query"

export class Resolvers {
    constructor(
        private readonly app: App
    ) { }
    
    content() {
        return {
            Planet,
            Query: new QueryResolver(this.app).content()
        }
    }
}