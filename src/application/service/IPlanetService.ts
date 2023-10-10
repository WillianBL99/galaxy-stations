import { UUID } from "crypto";
import { IPlanet } from "../entity/Planet";
import { IPagination } from "../../utils/Type";
interface IPlanetService {
    list(pagination: IPagination): Promise<IPlanet[]>
    getById(id: UUID): Promise<IPlanet | null>
    getByName(name: string): Promise<IPlanet | null>
    update(planet: IPlanet): Promise<IPlanet>
}

export { IPlanetService }