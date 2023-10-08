import { randomUUID } from "crypto"

type RechargeStatus = "done" | "reserved" | "charging"
interface IRecharge extends IBase {
    id: string
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status: RechargeStatus
}

interface RechargeData extends BaseData {
    id?: string,
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status: RechargeStatus
}

class Recharge implements IRecharge {
    readonly id: string
    readonly startTime: Date
    readonly endTime: Date
    pricePerMinute: number
    status: RechargeStatus
    readonly cratedAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, startTime, endTime, pricePerMinute, status, createdAt, updatedAt, deletedAt }: RechargeData) {
        this.id = id ?? randomUUID()
        this.startTime = startTime ?? new Date()
        this.endTime = endTime
        this.pricePerMinute = pricePerMinute
        this.status = status
        this.cratedAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IRecharge, RechargeData, Recharge, RechargeStatus }