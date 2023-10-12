import { Pagination } from "../../utils/Type";
import { StationData } from "../entity/Station";
import { CreateStationData, StationUseCase } from "../useCase/StationUseCase";
export interface IStationController {
    suitableStations(pagination: Pagination): Promise<StationData[]>
    create(data: CreateStationData): Promise<StationData>
}

export class StationController implements IStationController {
    constructor(private readonly stationUseCase: StationUseCase) { }

    async create({ stationName, planetName }: CreateStationData): Promise<StationData> {
        return await this.stationUseCase.create({ planetName, stationName });
    }

    async suitableStations(pagination: Pagination): Promise<StationData[]> {
        return this.stationUseCase.list(pagination)
    }
}