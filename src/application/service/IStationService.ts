import { UUID } from "crypto";
import { IStation } from "../entity/Station";

interface IStationService {
    create(station: IStation): Promise<IStation>;
    list(): Promise<IStation>
    getById(id: UUID): Promise<IStation | null>
    listByPlanet(planetId: UUID): Promise<IStation>
    update(Station: IStation): Promise<IStation>
}

export { IStationService }