import { UUID } from "crypto";
import { IRecharge, RechargeStatus } from "../entity/Recharge";

interface IRechargeService {
    create(Recharge: IRecharge): Promise<IRecharge>
    listByStation(id: UUID): Promise<IRecharge>
    getById(id: UUID): Promise<IRecharge>
    getByStatusAndStation(status: RechargeStatus, name: string): Promise<IRecharge>
}

export { IRechargeService }