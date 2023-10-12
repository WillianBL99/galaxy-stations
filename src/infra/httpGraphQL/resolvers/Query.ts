import { App } from "../../../application";
import { Pagination } from "../../../utils/Type";

export class QueryResolver {
    constructor(private readonly app: App) { }
    content() {
        const suitablePlanets = () => {
            const pagination = new Pagination({ active: false });
            return this.app.controller.planet.suitablePlanets(pagination);
        }
        return {
            suitablePlanets
        }
    }
}


