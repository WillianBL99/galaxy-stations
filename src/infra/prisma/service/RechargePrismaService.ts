import { Recharge, PrismaClient } from "@prisma/client";
import { IRecharge, RechargeStatus } from "../../../application/entity/Recharge";
import { IRechargeService } from "../../../application/service/IRechargeService";
import { IPagination, Pagination } from "../../../utils/Type";
import { Parsers } from "../../../utils/Parsers";
import { AppError } from "../../../error/Errors";


export class RechargePrismaService implements IRechargeService {
    constructor(private readonly prisma: PrismaClient) { }

    private parserData(raw: Recharge): IRecharge {
        return {
            id: raw.id,
            pricePerMinute: raw.pricePerMinute,
            startTime: raw.startTime,
            endTime: raw.endTime,
            status: raw.status,
            stationId: raw.stationId,
            userId: raw.userId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
            deletedAt: raw.deletedAt ?? undefined,
        }
    }

    private parseRaw(data: IRecharge): Recharge {
        return {
            ...data,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            updatedAt: data.updatedAt ?? null,
            deletedAt: data.deletedAt ?? null
        }
    }

    async create(recharge: IRecharge): Promise<IRecharge> {
        try {
            const created = await this.prisma.recharge.create({
                data: this.parseRaw(recharge)
            })
            return this.parserData(created)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async getById(id: string): Promise<IRecharge | null> {
        try {
            const recharge = await this.prisma.recharge.findFirst({
                where: { AND: { id, deletedAt: undefined } },
            })
            if (recharge) {
                return this.parserData(recharge)
            }
            return null
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async listByStation(stationId: string, pagination: IPagination): Promise<IRecharge[]> {
        try {
            const pg = Parsers.paginationToPrisma(pagination)
            const stations = await this.prisma.recharge.findMany({
                where: { AND: { stationId, deletedAt: undefined } },
                ...pg
            })
            return stations.map(this.parserData)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async listByStatusAndStation(status: RechargeStatus, stationId: string, pagination: IPagination): Promise<IRecharge[]> {
        try {
            const pg = Parsers.paginationToPrisma(pagination)
            const stations = await this.prisma.recharge.findMany({
                where: { AND: { status, stationId, deletedAt: undefined } },
                ...pg
            })
            return stations.map(this.parserData)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async listByStatusAndUser(status: RechargeStatus, userId: string, pagination: IPagination): Promise<IRecharge[]> {
        try {
            const pg = Parsers.paginationToPrisma(pagination)
            const stations = await this.prisma.recharge.findMany({
                where: { AND: { status, userId, deletedAt: undefined } },
                ...pg
            })
            return stations.map(this.parserData)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async update(recharge: IRecharge): Promise<IRecharge> {
        try {
            const updatedPlanet = await this.prisma.recharge.update({
                where: { id: recharge.id },
                data: {
                    pricePerMinute: recharge.pricePerMinute,
                    startTime: recharge.startTime,
                    endTime: recharge.endTime,
                    status: recharge.status,
                    updatedAt: recharge.updatedAt,
                }
            })
            return this.parserData(updatedPlanet)
        } catch (error) {
            AppError.throw("internalError")
        }
    }

    async delete(id: string): Promise<IRecharge> {
        try {
            const updatedPlanet = await this.prisma.recharge.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                }

            })
            return this.parserData(updatedPlanet)
        } catch (error) {
            AppError.throw("internalError")
        }
    }
}