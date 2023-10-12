import { IPlanet } from "../entity/Planet";
import { IPagination } from "../../utils/Type";

export interface IPlanetService {
    create(planet: IPlanet): Promise<IPlanet>
    list(pagination: IPagination): Promise<IPlanet[]>
    getById(id: string): Promise<IPlanet | null>
    getByName(name: string): Promise<IPlanet | null>
    update(planet: IPlanet): Promise<IPlanet>
    upsert(planet: IPlanet): Promise<IPlanet>
}
