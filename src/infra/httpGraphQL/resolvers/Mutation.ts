import { AppController } from "../../../application/controller";
import { CreateRechargeRequest } from "../../../application/useCase/RechargeUseCase";
import { MyContext } from "../Server";
import { AuthContext } from "../context/AuthContext";

type InstallStationInput = {
    input: {
        name: string
        planet: string
    }
}

type RechargeInput = {
    input: Omit<CreateRechargeRequest, "userId">
}

export class MutationResolver {
    constructor(
        private readonly auth: AuthContext,
        private readonly appController: AppController
    ) { }

    private installStation = async (_: any, args: InstallStationInput, context: MyContext) => {
        const data = await this.auth.validateToken(context?.headers?.authorization)
        const { name: stationName, planet: planetName } = args.input
        const station = await this.appController.station.create({ stationName, planetName })
        return station
    }

    private recharge = async (_: any, args: RechargeInput, context: MyContext) => {
        const data = await this.auth.validateToken(context?.headers?.authorization)
        const { stationId, endTime } = args.input
        const recharge = await this.appController.recharge.recharge({
            userId: data.userId,
            stationId,
            endTime,
        })
        return recharge
    }

    content() {
        return {
            installStation: this.installStation,
            recharge: this.recharge
        }
    }
}