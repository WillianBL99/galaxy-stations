import { UUID } from "crypto";
import { IRecharge, RechargeStatus } from "../entity/Recharge";
import { IPagination } from "../../utils/Type";

interface IRechargeService {
    create(recharge: IRecharge): Promise<IRecharge>
    listByStation(stationId: UUID, pagination: IPagination): Promise<IRecharge[]>
    getById(id: UUID): Promise<IRecharge | null>
    listByStatusAndStation(status: RechargeStatus, stationId: UUID, pagination: IPagination): Promise<IRecharge[]>
    listByStatusAndUser(status: RechargeStatus, userId: UUID, pagination: IPagination): Promise<IRecharge[]>
    update(recharge: IRecharge): Promise<IRecharge>
    delete(id: UUID): Promise<IRecharge>
}

export { IRechargeService }