import { AppService } from "../service";
import { IPlanetGateWay, PlanetGateWay } from "./PlanetGateway";

export class AppGateway {
    planet: IPlanetGateWay

    constructor(private readonly appService: AppService) {
        this.planet = new PlanetGateWay(this.appService.planet)
    }
}