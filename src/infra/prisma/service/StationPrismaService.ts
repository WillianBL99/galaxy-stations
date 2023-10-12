import { Station, PrismaClient } from "@prisma/client";
import { IStation } from "../../../application/entity/Station";
import { IStationService } from "../../../application/service/IStationService";
import { IPagination } from "../../../utils/Type";
import { Parsers } from "../../../utils/Parsers";


export class StationPrismaService implements IStationService {
    constructor(private readonly prisma: PrismaClient) { }

    create(station: IStation): Promise<IStation> {
        throw new Error("Method not implemented.");
    }
    list(pagination: IPagination): Promise<IStation[]> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<IStation | null> {
        throw new Error("Method not implemented.");
    }
    getByName(name: string): Promise<IStation | null> {
        throw new Error("Method not implemented.");
    }
    listByPlanet(planetId: pagination, IPagination: any): Promise<IStation[]> {
        throw new Error("Method not implemented.");
    }
    update(Station: IStation): Promise<IStation> {
        throw new Error("Method not implemented.");
    }

}