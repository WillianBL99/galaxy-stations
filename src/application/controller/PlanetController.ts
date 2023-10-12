import { Pagination } from "../../utils/Type";
import { PlanetData } from "../entity/Planet";
import { PlanetUseCase } from "../useCase/PlanetUseCase";

export interface IPlanetController {
    suitablePlanets(pagination: Pagination): Promise<PlanetData[]>
}

export class PlanetController implements IPlanetController {
    constructor(private readonly planetUseCase: PlanetUseCase) {}

    suitablePlanets(pagination: Pagination): Promise<PlanetData[]> {
        return this.planetUseCase.list(pagination)
    }
}