import { UUID } from "crypto"
import { IPlanet, Planet } from "../../application/entity/Planet"
import { IPlanetService } from "../../application/service/IPlanetService"
import { IPagination } from "../../utils/Type"

export class PlanetServiceInMemory implements IPlanetService {
    planets: IPlanet[]
    constructor() {
        this.planets = []
    }
    async list(pagination: IPagination): Promise<IPlanet[]> {
        return this.planets
    }
    async getById(id: string): Promise<IPlanet | null> {
        return this.planets.find(planet => planet.id === id) || null;
    }
    async getByName(name: string): Promise<IPlanet | null> {
        return this.planets.find(planet => planet.name === name) || null;
    }
    async update(planet: IPlanet): Promise<IPlanet> {
        let founded = false
        this.planets = this.planets.map(p => {
            if (p.id === planet.id) {
                founded = true;
                return planet
            }
            return p
        })

        if (!founded) {
            throw new Error();
        }
        return planet
    }

}