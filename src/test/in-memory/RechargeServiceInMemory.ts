import { UUID } from "crypto"
import { IRecharge, Recharge, RechargeStatus } from "../../application/entity/Recharge"
import { IRechargeService } from "../../application/service/IRechargeService"
import { IPagination } from "../../utils/Type"

export class RechargeServiceInMemory implements IRechargeService {
    recharges: IRecharge[]
    constructor() {
        this.recharges = []
    }
    async create(recharge: IRecharge): Promise<IRecharge> {
        this.recharges.push(recharge)
        return recharge
    }
    async listByStation(stationId: string, pagination: IPagination): Promise<IRecharge[]> {
        return this.recharges.filter(recharge => recharge.stationId === stationId)
    }
    async getById(id: string): Promise<IRecharge | null> {
        return this.recharges.find(recharge => recharge.id === id) || null
    }
    async listByStatusAndStation(status: RechargeStatus, stationId: string, pagination: IPagination): Promise<IRecharge[]> {
        return this.recharges.filter((recharge) => {
            return recharge.stationId === stationId && recharge.status === status
        })
    }
    async listByStatusAndUser(status: RechargeStatus, userId: string, pagination: IPagination): Promise<IRecharge[]> {
        return this.recharges.filter((recharge) => {
            return recharge.userId === userId && recharge.status === status
        })
    }
    async update(recharge: IRecharge): Promise<IRecharge> {
        let founded = false
        this.recharges = this.recharges.map(p => {
            if (p.id === recharge.id) {
                founded = true;
                return recharge
            }
            return p
        })

        if (!founded) {
            throw new Error();
        }
        return recharge
    }
    async delete(id: string): Promise<IRecharge> {
        let recharge = null
        this.recharges = this.recharges.filter(c => {
            if (c.id !== id) return true
            recharge = c
        })
        if (recharge) {
            return recharge
        }
        throw new Error()
    }
}