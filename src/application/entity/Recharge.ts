import { UUID, randomUUID } from "crypto"

type RechargeStatus = "done" | "reserved" | "charging"
interface IRecharge extends IBase {
    id: UUID
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status: RechargeStatus
    userId: UUID,
    stationId: UUID
}

interface RechargeData extends BaseData {
    id?: UUID,
    startTime: Date
    endTime: Date
    pricePerMinute: number
    status?: RechargeStatus
    userId: UUID
    stationId: UUID
}

class Recharge implements IRecharge {
    readonly id: UUID
    readonly startTime: Date
    readonly endTime: Date
    readonly pricePerMinute: number
    status: RechargeStatus
    readonly userId: UUID
    readonly stationId: UUID
    readonly cratedAt: Date
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
        this.cratedAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IRecharge, RechargeData, Recharge, RechargeStatus }