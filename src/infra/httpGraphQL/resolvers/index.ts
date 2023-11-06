import { App } from "../../../application"
import { AuthContext } from "../context/AuthContext"
import { MutationResolver } from "./Mutation"
import { Planet, PlanetResolver } from "./Planets"
import { QueryResolver } from "./Query"
import { StationHistoryResolver } from "./StationHistory"

export class Resolvers {
    constructor(
        private readonly auth: AuthContext,
        private readonly app: App
    ) {

    }

    content() {
        return {
            Query: new QueryResolver(this.app.controller).content(),
            Mutation: new MutationResolver(this.auth, this.app.controller).content(),
            StationHistory: new StationHistoryResolver(this.app.controller).content(),
            Planet: new PlanetResolver(this.app.controller).content(),
        }
    }
}