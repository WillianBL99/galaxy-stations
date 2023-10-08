import { UUID } from "crypto";
import { IRecharge, RechargeStatus } from "../entity/Recharge";

interface IRechargeService {
    create(Recharge: IRecharge): Promise<IRecharge>
    listByStation(stationId: UUID, pagination: Pagination): Promise<IRecharge>
    getById(id: UUID): Promise<IRecharge | null>
    listByStatusAndStation(status: RechargeStatus, name: string): Promise<IRecharge>
}

export { IRechargeService }