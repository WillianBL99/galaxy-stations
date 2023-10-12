import { AppController } from "../../../application/controller";
import { IPagination, Pagination } from "../../../utils/Type";

type GQLPagination = {
    pagination: Omit<IPagination, "active">
}
export class QueryResolver {
    constructor(private readonly appController: AppController) { }

    private suitablePlanets = (_: any, gqlP: GQLPagination) => {
        const { page, offset } = gqlP.pagination ?? {}
        const pagination = new Pagination({ active: false });
        if (page >= 0) {
            pagination.activate(page, offset)
        }
        return this.appController.planet.suitablePlanets(pagination);
    }

    private stations = (_: any, gqlP: GQLPagination) => {
        const { page, offset } = gqlP.pagination ?? {}
        const pagination = new Pagination({ active: false });
        if (page >= 0) {
            pagination.activate(page, offset)
        }
        return this.appController.station.suitableStations(pagination)
    }

    private stationHistory = (_: any, { pagination, stationId }: { pagination: Omit<IPagination, "active">, stationId: string }) => {
        const { page, offset } = pagination ?? {}
        const pg = new Pagination({ active: false });
        if (page >= 0) {
            pg.activate(page, offset)
        }
        return this.appController.recharge.listByStation(stationId, pg)
    }

    content() {

        return {
            suitablePlanets: this.suitablePlanets,
            stations: this.stations,
            stationHistory: this.stationHistory,
        }
    }
}


