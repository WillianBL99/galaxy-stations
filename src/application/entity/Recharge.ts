import { randomUUID } from "crypto"

type RechargeStatus = "done" | "reserved" | "charging"
interface IRecharge extends IBase {
    id: string
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status: RechargeStatus
    userId: string,
    stationId: string
}

interface RechargeData extends BaseData {
    id?: string,
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status?: RechargeStatus
    userId: string
    stationId: string
}

class Recharge implements IRecharge {
    readonly id: string
    readonly startTime: Date
    readonly endTime: Date
    readonly pricePerMinute: number
    status: RechargeStatus
    readonly userId: string
    readonly stationId: string
    readonly createdAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({
        id,
        startTime,
        endTime,
        pricePerMinute,
        status,
        userId,
        stationId,
        createdAt,
        updatedAt,
        deletedAt
    }: RechargeData) {
        this.id = id ?? randomUUID()
        this.startTime = startTime ?? new Date()
        this.endTime = endTime
        this.pricePerMinute = pricePerMinute
        this.status = status ?? "done"
        this.userId = userId
        this.stationId = stationId
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IRecharge, RechargeData, Recharge, RechargeStatus }