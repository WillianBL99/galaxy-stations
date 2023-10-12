import { Station, PrismaClient } from "@prisma/client";
import { IStation } from "../../../application/entity/Station";
import { IStationService } from "../../../application/service/IStationService";
import { IPagination } from "../../../utils/Type";
import { Parsers } from "../../../utils/Parsers";


export class StationPrismaService implements IStationService {
    constructor(private readonly prisma: PrismaClient) { }

    private parserData(raw: Station): IStation {
        return {
            id: raw.id,
            name: raw.name,
            charging: raw.charging,
            planetId: raw.planetId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
            deletedAt: raw.deletedAt ?? undefined,
        }
    }

    private parseRaw(data: IStation): Station {
        return {
            ...data,
            updatedAt: data.updatedAt ?? null,
            deletedAt: data.deletedAt ?? null
        }
    }

    async create(station: IStation): Promise<IStation> {
        try {
            const created = await this.prisma.station.create({
                data: this.parseRaw(station)
            })
            return this.parserData(created)
        } catch (error) {
            throw new Error("Prisma - Station: " + error)
        }
    }
    async list(pagination: IPagination): Promise<IStation[]> {
        try {
            const pg = Parsers.paginationToPrisma(pagination)
            const stations = await this.prisma.station.findMany(pg)
            return stations.map(this.parserData)
        } catch (error) {
            throw new Error("Prisma - Station: " + error)
        }
    }
    async getById(id: string): Promise<IStation | null> {
        try {
            const station = await this.prisma.station.findUnique({
                where: { id }
            })
            if (station) {
                return this.parserData(station)
            }
            return null
        } catch (error) {
            throw new Error("Prisma - Station: " + error)
        }
    }
    async getByName(name: string): Promise<IStation | null> {
        try {
            console.log({ name })
            const station = await this.prisma.station.findUnique({
                where: { name }
            })
            if (station) {
                return this.parserData(station)
            }
            return null
        } catch (error) {
            throw new Error("Prisma - Station: " + error)
        }
    }
    async listByPlanet(planetId: string, pagination: IPagination): Promise<IStation[]> {
        try {
            const pg = Parsers.paginationToPrisma(pagination)
            const stations = await this.prisma.station.findMany({
                where: { planet: { id: planetId } }
            })
            return stations.map(this.parserData)
        } catch (error) {
            throw new Error("Prisma - Station: " + error)
        }
    }
    async update(station: IStation): Promise<IStation> {
        try {
            const updatedPlanet = await this.prisma.station.update({
                where: { id: station.id },
                data: {
                    name: station.name,
                    updatedAt: station.updatedAt,
                    charging: station.charging,
                    planetId: station.planetId,
                }
            })
            return this.parserData(updatedPlanet)
        } catch (error) {
            throw new Error("Prisma - Planet: " + error)
        }
    }

}