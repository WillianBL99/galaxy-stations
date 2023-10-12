import { AppController } from "../../../application/controller";
import { IPagination, Pagination } from "../../../utils/Type";

type GQLPagination = {
    pagination: Omit<IPagination, "active">
}
export class QueryResolver {
    constructor(private readonly appController: AppController) { }
    content() {
        const suitablePlanets = (_: any, gqlP: GQLPagination) => {
            const { page, offset } = gqlP.pagination
            const pagination = new Pagination({ active: false });
            if (page >= 0) {
                pagination.activate(page, offset)
            }
            return this.appController.planet.suitablePlanets(pagination);
        }
        const stations = () => {

        }
        return {
            suitablePlanets
        }
    }
}


