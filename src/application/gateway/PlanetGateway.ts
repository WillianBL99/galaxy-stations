import { IPlanet } from "../entity/Planet";
import { IPlanetService } from "../service";

export interface IPlanetGateWay {
    upsert(planet: IPlanet): Promise<void>
}

export class PlanetGateWay implements IPlanetGateWay {
    constructor(private readonly planetService: IPlanetService) { }
    async upsert(planet: IPlanet): Promise<void> {
        await this.planetService.upsert(planet)
    }
}