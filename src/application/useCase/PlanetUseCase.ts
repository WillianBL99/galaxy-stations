import { IPlanetService } from "../service/IPlanetService";
import { IPlanet } from "../entity/Planet";
import { UUID } from "crypto";
import { IPagination } from "../utils/Type";
import { appErrors } from "../../error/Errors";

type PlanetResponse = Omit<IPlanet, "deletedAt">

export class PlanetUseCase {
    constructor(private readonly planetService: IPlanetService) { }

    protected static parsePlanet(Planet: IPlanet): PlanetResponse {
        return {
            id: Planet.id,
            name: Planet.name,
            checkedAt: Planet.checkedAt,
            hasStation: Planet.hasStation,
            cratedAt: Planet.cratedAt,
            updatedAt: Planet.updatedAt
        }
    }

    async list(pagination: IPagination): Promise<PlanetResponse[]> {
        const planets = await this.planetService.list(pagination)
        return planets.map(PlanetUseCase.parsePlanet)
    }

    async getByName(name: string): Promise<PlanetResponse | null> {
        const planet = await this.planetService.getByName(name)
        if (!planet) {
            throw new Error(appErrors.planetNotFound)
        }
        return planet
    }

    async getById(id: UUID): Promise<PlanetResponse | null> {
        const planet = await this.planetService.getById(id)
        if (!planet) {
            throw new Error(appErrors.planetNotFound)
        }
        return planet
    }

    async updateHasStation(planetId: UUID, hasStation: boolean): Promise<PlanetResponse> {
        const planet = await this.planetService.getById(planetId)
        if (!planet) {
            throw new Error(appErrors.planetNotFound)
        }
        const planetResponse = await this.planetService.update({
            ...planet,
            hasStation: hasStation,
            updatedAt: new Date()
        })
        return PlanetUseCase.parsePlanet(planetResponse)
    }
}