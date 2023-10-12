export * from "./IPlanetService"
export * from "./IRechargeService"
export * from "./IStationService"
export * from "./IUserService"
import { IPlanetService } from "./IPlanetService"
import { IStationService } from "./IStationService"
import { IRechargeService } from "./IRechargeService"
import { IUserService } from "./IUserService"
import { PrismaClient } from "@prisma/client"
import { PlanetPrismaService } from "../../infra/prisma/service/PlanetPrismaService"
import { RechargePrismaService } from "../../infra/prisma/service/RechargePrismaService"
import { StationPrismaService } from "../../infra/prisma/service/StationPrismaService"
import { UserPrismaService } from "../../infra/prisma/service/UserPrismaService"


export class AppService {
    planet: IPlanetService
    station: IStationService
    recharge: IRechargeService
    user: IUserService
    constructor(private readonly prismaClient: PrismaClient) {
        this.planet = new PlanetPrismaService(this.prismaClient)
        this.station = new StationPrismaService(this.prismaClient)
        this.recharge = new RechargePrismaService(this.prismaClient)
        this.user = new UserPrismaService(this.prismaClient)
    }
}