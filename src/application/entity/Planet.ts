import { UUID, randomUUID } from "crypto"

interface IPlanet extends IBase {
    id: UUID
    name: string
    checkedAt: Date
    hasStation: boolean
}

interface PlanetData extends BaseData {
    id?: UUID,
    name: string,
    checkedAt?: Date
    hasStation: boolean,
}

class Planet implements IPlanet {
    readonly id: UUID
    name: string
    hasStation: boolean
    checkedAt: Date
    cratedAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, name, hasStation, checkedAt, createdAt, updatedAt, deletedAt }: PlanetData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.hasStation = hasStation
        this.checkedAt = checkedAt || new Date()
        this.cratedAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IPlanet, PlanetData, Planet }