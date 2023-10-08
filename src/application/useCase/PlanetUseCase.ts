import { IPlanetService } from "../service/IPlanetService";
import { IPlanet, PlanetData } from "../entity/Planet";
import { UUID } from "crypto";
import { } from "jsonwebtoken"

type PlanetResponse = Omit<IPlanet, "deletedAt">

export class PlanetUseCase {
    constructor(private readonly planetService: IPlanetService) { }

    private parsePlanet(Planet: IPlanet): PlanetResponse {
        return {
            id: Planet.id,
            name: Planet.name,
            checkedAt: Planet.checkedAt,
            hasStation: Planet.hasStation,
            cratedAt: Planet.cratedAt,
            updatedAt: Planet.updatedAt
        }
    }

    async list(pagination: Pagination): Promise<PlanetResponse[]> {
        try {
            const planets = await this.planetService.list(pagination)
            return planets.map(this.parsePlanet)
        } catch (error) {
            console.log("Internal server error: ", error)
        }
        return [];
    }

    async getByName(name: string): Promise<PlanetResponse | null> {
        try {
            const planet = await this.planetService.getByName(name)
            return planet
        } catch (error) {
            console.log("Internal server error: ", error)            
        }
        return null
    }

    async getById(id: UUID): Promise<PlanetResponse | null> {
        try {
            const planet = await this.planetService.getById(id)
            return planet
        } catch (error) {
            console.log("Internal server error: ", error)            
        }
        return null
    }

    async updateHasStation(planetId: UUID, hasStation: boolean): Promise<PlanetResponse | null> {
        try {
            const planet = await this.planetService.getById(planetId)
            if (!planet) {
                throw new Error(`Planet ${planetId} not found`)
            }
            planet.hasStation = hasStation
            const planetResponse = await this.planetService.update(planet)
            return this.parsePlanet(planetResponse)
        } catch (error) {
            console.log("Internal server error: ", error) 
        }
        return null
    }
}