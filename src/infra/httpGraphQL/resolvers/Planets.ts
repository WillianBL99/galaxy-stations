import { AppController } from "../../../application/controller";
import { IPagination, Pagination } from "../../../utils/Type";

export class PlanetResolver {
    constructor(private readonly appController: AppController) { }

    private stations = (parent: any, _args: any, _context: any) => {
        const pg = new Pagination({ active: false });
        return this.appController.station.listByPlanet(parent.id, pg);
    }

    content() {
        return {
            stations: this.stations,
        }
    }
}


