import { UUID } from "crypto";
import { IStation } from "../entity/Station";

interface IStationService {
    create(station: IStation): Promise<IStation>;
    list(pagination: IPagination): Promise<IStation[]>
    getById(id: UUID): Promise<IStation | null>
    getByName(name: string): Promise<IStation | null>
    listByPlanet(planetId: UUID, pagination: IPagination): Promise<IStation[]>
    update(Station: IStation): Promise<IStation>
}

export { IStationService }