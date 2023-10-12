
import { IPagination } from "../../utils/Type";
import { IStation } from "../entity/Station";

interface IStationService {
    create(station: IStation): Promise<IStation>;
    list(pagination: IPagination): Promise<IStation[]>
    getById(id: string): Promise<IStation | null>
    getByName(name: string): Promise<IStation | null>
    listByPlanet(planetId: string, pagination: IPagination): Promise<IStation[]>
    update(Station: IStation): Promise<IStation>
}

export { IStationService }