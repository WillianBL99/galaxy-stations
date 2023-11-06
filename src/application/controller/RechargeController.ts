import { AppMessageType } from "../../message/Message";
import { Pagination } from "../../utils/Type";
import { RechargeData } from "../entity/Recharge";
import { CreateRechargeRequest, CreateReserveRequest, RechargeResponse, RechargeUseCase } from "../useCase/RechargeUseCase";

export interface IRechargeController {
    recharge(data: CreateRechargeRequest): Promise<AppMessageType>
    reserve(data: CreateReserveRequest): Promise<AppMessageType>
    listByStation(stationId: string, pagination: Pagination): Promise<RechargeResponse[]>
}

export class RechargeController implements IRechargeController {
    constructor(private readonly rechargeUseCase: RechargeUseCase) { }
    async reserve({ userId, stationId, startTime, endTime }: CreateReserveRequest): Promise<AppMessageType> {
        return await this.rechargeUseCase.reserve({ userId, stationId, startTime, endTime });
    }

    async recharge({ userId, stationId, endTime }: CreateRechargeRequest): Promise<AppMessageType> {
        return await this.rechargeUseCase.recharge({ userId, stationId, endTime })
    }

    async listByStation(stationId: string, pagination: Pagination): Promise<RechargeResponse[]> {
        return await this.rechargeUseCase.listByStation(stationId, pagination)
    }

}