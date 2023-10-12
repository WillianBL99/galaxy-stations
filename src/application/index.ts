import { PrismaClient } from "@prisma/client";
import { AppService } from "./service";
import { AppUseCase } from "./useCase";
import { AppController } from "./controller";
import { IEncryptor } from "../utils/Encryptor";
import { IAppConfig, ICashConfig } from "../config/Config";
import { AppGateway } from "./gateway";

class Encryptor implements IEncryptor {
    hash(data: string): string {
        throw new Error("Method not implemented.");
    }
    compare(data: string, encrypted: string): boolean {
        throw new Error("Method not implemented.");
    }
}

class AppConfig implements IAppConfig {
    pricePerMinute: number;
    constructor() {
        this.pricePerMinute = 5
    }
}

export class App {
    service: AppService
    useCase: AppUseCase
    controller: AppController
    gateway: AppGateway

    constructor(private readonly prismaClient: PrismaClient) {
        this.service = new AppService(this.prismaClient)
        this.useCase = new AppUseCase(
            this.service,
            new AppConfig(),
            new Encryptor()
        )
        this.controller = new AppController(this.useCase)
        this.gateway = new AppGateway(this.service)
    }
}

export { AppUseCase };
