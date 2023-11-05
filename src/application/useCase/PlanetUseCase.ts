import { IPlanetService } from "../service/IPlanetService";
import { IPlanet } from "../entity/Planet";
import { IPagination } from "../../utils/Type";
import { AppError } from "../../message/Errors";

type PlanetResponse = Omit<IPlanet, "deletedAt">

export class PlanetUseCase {
    constructor(private readonly planetService: IPlanetService) { }

    protected static parsePlanet(Planet: IPlanet): PlanetResponse {
        return {
            id: Planet.id,
            name: Planet.name,
            mass: Planet.mass,
            hasStation: Planet.hasStation,
            checkedAt: Planet.checkedAt,
            createdAt: Planet.createdAt,
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
            AppError.throw({typeErr: "planetNotFound"})
        }
        return planet
    }

    async getById(id: string): Promise<PlanetResponse | null> {
        const planet = await this.planetService.getById(id)
        if (!planet) {
            AppError.throw({typeErr: "planetNotFound"})
        }
        return planet
    }

    async updateHasStation(planetId: string, hasStation: boolean): Promise<PlanetResponse> {
        const planet = await this.planetService.getById(planetId)
        if (!planet) {
            AppError.throw({typeErr: "planetNotFound"})
        }
        const planetResponse = await this.planetService.update({
            ...planet,
            hasStation: hasStation,
            updatedAt: new Date()
        })
        return PlanetUseCase.parsePlanet(planetResponse)
    }
}