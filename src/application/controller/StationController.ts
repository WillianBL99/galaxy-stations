import { Pagination } from "../../utils/Type";
import { StationData } from "../entity/Station";
import { StationUseCase } from "../useCase/StationUseCase";

export interface IStationController {
    suitableStations(pagination: Pagination): Promise<StationData[]>
}

export class StationController implements IStationController {
    constructor(private readonly stationUseCase: StationUseCase) {}

    suitableStations(pagination: Pagination): Promise<StationData[]> {
        return this.stationUseCase.list(pagination)
    }
}