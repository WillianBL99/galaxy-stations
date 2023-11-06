import { Pagination } from "../../utils/Type";
import { StationData } from "../entity/Station";
import { RechargeUseCase } from "../useCase/RechargeUseCase";
import { CreateStationData, StationUseCase } from "../useCase/StationUseCase";


export type StationHistory = {
    startTime: Date
    duration: number
    userId: string
}
export interface IStationController {
    create(data: CreateStationData): Promise<StationData>
    suitableStations(pagination: Pagination): Promise<StationData[]>
    history(stationId: string, pagination: Pagination): Promise<StationHistory[]>
}
export class StationController implements IStationController {
    constructor(
        private readonly stationUseCase: StationUseCase,
        private readonly rechargeUseCase: RechargeUseCase
    ) { }

    async create({ stationName, planetName }: CreateStationData): Promise<StationData> {
        return await this.stationUseCase.create({ planetName, stationName });
    }
    
    async suitableStations(pagination: Pagination): Promise<StationData[]> {
        return this.stationUseCase.list(pagination)
    }

    async history(stationId: string, pagination: Pagination): Promise<StationHistory[]> {
        const history = await this.rechargeUseCase.listByStation(stationId, pagination)
        return history.map<StationHistory>(stationHistory => {
            const { startTime, endTime, userId } = stationHistory
            return {
                userId,
                startTime,
                duration: endTime.getTime() - startTime.getTime(),
            }
        })
    }
}