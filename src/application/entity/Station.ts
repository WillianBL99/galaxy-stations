import { randomUUID } from "crypto"

interface IStation extends IBase {
    id: string
    name: string
    occupied: boolean
}

interface StationData extends BaseData {
    id?: string,
    name: string,
    occupied: boolean
}

class Station implements IStation {
    readonly id: string
    name: string
    occupied: boolean
    cratedAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, name, occupied, createdAt, updatedAt, deletedAt }: StationData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.occupied = occupied
        this.cratedAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IStation, StationData, Station }