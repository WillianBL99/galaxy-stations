import { UUID, randomUUID } from "crypto"

interface IStation extends IBase {
    id: UUID
    name: string
    charging: boolean
    planetId: UUID
}

interface StationData extends BaseData {
    id?: UUID,
    name: string,
    charging?: boolean
    planetId: UUID
}

class Station implements IStation {
    readonly id: UUID
    name: string
    charging: boolean
    planetId: UUID
    cratedAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, name, charging, planetId, createdAt, updatedAt, deletedAt }: StationData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.charging = charging ?? false
        this.planetId = planetId
        this.cratedAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IStation, StationData, Station }