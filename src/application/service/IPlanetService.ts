import { UUID } from "crypto";
import { IPlanet } from "../entity/Planet";

interface IPlanetService {
    list(id: UUID): Promise<IPlanet>
    getById(id: UUID): Promise<IPlanet>
    getByName(name: string): Promise<IPlanet>
    update(planet: IPlanet): Promise<IPlanet>
}

export { IPlanetService }