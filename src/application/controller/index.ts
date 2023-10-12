import { AppUseCase } from ".."
import { PlanetController } from "./PlanetController"
import { RechargeController } from "./RechargeController"
import { StationController } from "./StationController"
import { UserController } from "./UserController"


export class AppController {
    planet: PlanetController
    station: StationController
    recharge: RechargeController
    user: UserController

    constructor(private readonly appUseCase: AppUseCase) {
        this.planet = new PlanetController(appUseCase.planet)
        this.station = new StationController(appUseCase.station)
        this.recharge = new RechargeController(appUseCase.recharge)
        this.user = new UserController(appUseCase.user)
    }
}