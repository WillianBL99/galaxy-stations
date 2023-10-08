import { UUID } from "crypto";
import { IStation } from "../entity/Station";

interface IStationService {
    create(station: IStation): Promise<IStation>;
    list(id: UUID): Promise<IStation>
    getById(id: UUID): Promise<IStation>
    getByPlanet(planetId: UUID): Promise<IStation>
    update(Station: IStation): Promise<IStation>
}

export { IStationService }