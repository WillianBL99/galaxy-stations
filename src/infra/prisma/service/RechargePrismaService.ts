import { Recharge, PrismaClient } from "@prisma/client";
import { IRecharge, RechargeStatus } from "../../../application/entity/Recharge";
import { IRechargeService } from "../../../application/service/IRechargeService";
import { IPagination, Pagination } from "../../../utils/Type";
import { Parsers } from "../../../utils/Parsers";


export class RechargePrismaService implements IRechargeService {
    constructor(private readonly prisma: PrismaClient) { }
    
    create(recharge: IRecharge): Promise<IRecharge> {
        throw new Error("Method not implemented.");
    }
    listByStation(stationId: String, pagination: IPagination): Promise<IRecharge[]> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<IRecharge | null> {
        throw new Error("Method not implemented.");
    }
    listByStatusAndStation(status: RechargeStatus, stationId: string, pagination: IPagination): Promise<IRecharge[]> {
        throw new Error("Method not implemented.");
    }
    listByStatusAndUser(status: RechargeStatus, userId: string, pagination: IPagination): Promise<IRecharge[]> {
        throw new Error("Method not implemented.");
    }
    update(recharge: IRecharge): Promise<IRecharge> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<IRecharge> {
        throw new Error("Method not implemented.");
    }
}