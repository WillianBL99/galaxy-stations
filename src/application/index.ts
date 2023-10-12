import { PrismaClient } from "@prisma/client";
import { AppService } from "./service";
import { AppUseCase } from "./useCase";
import { AppController } from "./controller";
import { Encryptor, IEncryptor } from "../utils/Encryptor"
import { AppGateway } from "./gateway";
import { AppConfig, EncryptConfig } from "../config/Config";

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
            new Encryptor(new EncryptConfig())
        )
        this.controller = new AppController(this.useCase)
        this.gateway = new AppGateway(this.service)
    }
}

export { AppUseCase };
