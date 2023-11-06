import { AppMessageType } from "../../message/Message";
import { Pagination } from "../../utils/Type";
import { RechargeData } from "../entity/Recharge";
import { CreateRechargeRequest, CreateReserveRequest, RechargeReservationRequest, RechargeResponse, RechargeUseCase, ReserveResponse } from "../useCase/RechargeUseCase";

export interface IRechargeController {
    recharge(data: CreateRechargeRequest): Promise<AppMessageType>
    reserve(data: CreateReserveRequest): Promise<ReserveResponse>
    rechargeReserve(data: RechargeReservationRequest): Promise<AppMessageType>
}

export class RechargeController implements IRechargeController {
    constructor(private readonly rechargeUseCase: RechargeUseCase) { }
    async reserve({ userId, stationId, startTime, endTime }: CreateReserveRequest): Promise<ReserveResponse> {
        return await this.rechargeUseCase.reserve({ userId, stationId, startTime, endTime });
    }

    async recharge({ userId, stationId, endTime }: CreateRechargeRequest): Promise<AppMessageType> {
        return await this.rechargeUseCase.recharge({ userId, stationId, endTime })
    }

    async rechargeReserve({ reservationId }: RechargeReservationRequest): Promise<AppMessageType> {
        return await this.rechargeUseCase.rechargeReserve({ reservationId })
    }
}