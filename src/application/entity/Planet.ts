import { randomUUID } from "crypto"

interface IPlanet extends IBase {
    id: string
    name: string
    mass: number
    hasStation: boolean
    checkedAt: Date
}

interface PlanetData extends BaseData {
    id?: string,
    name: string,
    mass: number
    hasStation: boolean,
    checkedAt?: Date
}

class Planet implements IPlanet {
    readonly id: string
    name: string
    mass: number
    hasStation: boolean
    checkedAt: Date
    createdAt: Date
    updatedAt?: Date | undefined
    deletedAt?: Date | undefined

    constructor({ id, name, mass,hasStation, checkedAt, createdAt, updatedAt, deletedAt }: PlanetData) {
        this.id = id ?? randomUUID()
        this.name = name
        this.mass = mass
        this.hasStation = hasStation
        this.checkedAt = checkedAt || new Date()
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt
        this.deletedAt = deletedAt
    }
}

export { IPlanet, PlanetData, Planet }