
import { IRecharge, RechargeStatus } from "../entity/Recharge";
import { IPagination } from "../../utils/Type";

interface IRechargeService {
    create(recharge: IRecharge): Promise<IRecharge>
    listByStation(stationId: String, pagination: IPagination): Promise<IRecharge[]>
    getById(id: string): Promise<IRecharge | null>
    listByStatusAndStation(status: RechargeStatus, stationId: string, pagination: IPagination): Promise<IRecharge[]>
    listByStatusAndUser(status: RechargeStatus, userId: string, pagination: IPagination): Promise<IRecharge[]>
    update(recharge: IRecharge): Promise<IRecharge>
    delete(id: string): Promise<IRecharge>
}

export { IRechargeService }