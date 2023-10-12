import { AppConfig } from "../../config/Config"
import { IEncryptor } from "../../utils/Encryptor"
import { AppService } from "../service"
import { PlanetUseCase } from "./PlanetUseCase"
import { RechargeUseCase } from "./RechargeUseCase"
import { StationUseCase } from "./StationUseCase"
import { UserUseCase } from "./UserUseCase"

export class AppUseCase {
    planet: PlanetUseCase
    station: StationUseCase
    recharge: RechargeUseCase
    user: UserUseCase
    constructor(
        private readonly appService: AppService,
        private readonly appConfig: AppConfig,
        private readonly encryptor: IEncryptor
    ) {
        this.planet = new PlanetUseCase(appService.planet)
        this.station = new StationUseCase(appService.station, appService.planet)
        this.recharge = new RechargeUseCase(
            appService.recharge,
            appService.station,
            appService.user,
            appConfig
        )
        this.user = new UserUseCase(appService.user, this.encryptor)
    }
}