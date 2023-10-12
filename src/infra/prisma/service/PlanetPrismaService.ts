import { Planet, PrismaClient } from "@prisma/client";
import { IPlanet } from "../../../application/entity/Planet";
import { IPlanetService } from "../../../application/service/IPlanetService";
import { IPagination } from "../../../utils/Type";
import { Parsers } from "../../../utils/Parsers";
import { AppError } from "../../../error/Errors";


export class PlanetPrismaService implements IPlanetService {
    constructor(private readonly prisma: PrismaClient) { }

    private parserData(raw: Planet): IPlanet {
        return {
            id: raw.id,
            name: raw.name,
            mass: raw.mass,
            hasStation: raw.hasStation,
            checkedAt: raw.checkedAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
            deletedAt: raw.deletedAt ?? undefined,
        }
    }

    private parseRaw(data: IPlanet): Planet {
        return {
            ...data,
            createdAt: data.checkedAt,
            updatedAt: data.updatedAt ?? null,
            deletedAt: data.deletedAt ?? null
        }
    }

    async create(planet: IPlanet): Promise<IPlanet> {
        try {
            const createdPlanet = await this.prisma.planet.create({
                data: this.parseRaw(planet)
            })
            return this.parserData(createdPlanet)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async upsert(planet: IPlanet): Promise<IPlanet> {
        try {
            const parsedPlanet = this.parseRaw(planet)
            const createdPlanet = await this.prisma.planet.upsert({
                where: {name: planet.name},
                update: {
                    mass: parsedPlanet.mass,
                    updatedAt: parsedPlanet.updatedAt,
                },
                create: parsedPlanet
            })
            return this.parserData(createdPlanet)
        } catch (error) {
            AppError.throw("internalError")
        }      
    }

    async list(pagination: IPagination): Promise<IPlanet[]> {
        const pg = Parsers.paginationToPrisma(pagination)
        const planets = await this.prisma.planet.findMany(pg)
        return planets.map(this.parserData)
    }

    async getById(id: string): Promise<IPlanet | null> {
        try {
            const planet = await this.prisma.planet.findUnique({
                where: { id }
            })
            if (planet) {
                return this.parserData(planet)
            }
            return null
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async getByName(name: string): Promise<IPlanet | null> {
        try {
            const planet = await this.prisma.planet.findUnique({
                where: { name }
            })
            if (planet) {
                return this.parserData(planet)
            }
            return null
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async update(planet: IPlanet): Promise<IPlanet> {
        try {
            const updatedPlanet = await this.prisma.planet.update({
                where: { id: planet.id },
                data: {
                    hasStation: planet.hasStation,
                    mass: planet.mass,
                    updatedAt: planet.updatedAt,
                }
            })
            return this.parserData(updatedPlanet)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

}