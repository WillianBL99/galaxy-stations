import { Pagination } from "../../utils/Type";
import { RechargeData } from "../entity/Recharge";
import { CreateRechargeRequest, RechargeResponse, RechargeUseCase } from "../useCase/RechargeUseCase";

export interface IRechargeController {
    recharge(data: CreateRechargeRequest): Promise<RechargeResponse>
}

export class RechargeController implements IRechargeController {
    constructor(private readonly rechargeUseCase: RechargeUseCase) { }

    async recharge({ userId, stationId, endTime }: CreateRechargeRequest): Promise<RechargeResponse> {
        return await this.rechargeUseCase.recharge({ userId, stationId, endTime })
    }
}