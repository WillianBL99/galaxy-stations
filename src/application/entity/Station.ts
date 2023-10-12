import { randomUUID } from "crypto"

interface IStation extends IBase {
    id: string
    name: string
    charging: boolean
    planetId: string
}

interface StationData extends BaseData {
    id?: string,
    name: string,
    charging?: boolean
    planetId: string
}

class Station implements IStation {
    readonly id: string
    name: string
    charging: boolean
    planetId: string
    createdAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, name, charging, planetId, createdAt, updatedAt, deletedAt }: StationData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.charging = charging ?? false
        this.planetId = planetId
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IStation, StationData, Station }