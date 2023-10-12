import { Pagination } from "../../utils/Type";
import { RechargeData } from "../entity/Recharge";
import { RechargeUseCase } from "../useCase/RechargeUseCase";

export interface IRechargeController {
    suitableRecharges(pagination: Pagination): Promise<RechargeData[]>
}

export class RechargeController implements IRechargeController {
    constructor(private readonly rechargeUseCase: RechargeUseCase) {}

    suitableRecharges(pagination: Pagination): Promise<RechargeData[]> {
        return this.rechargeUseCase.list(pagination)
    }
}