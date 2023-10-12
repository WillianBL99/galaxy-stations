import { AppController } from "../../../application/controller";
import { CreateRechargeRequest } from "../../../application/useCase/RechargeUseCase";
import { CreateUserRequest } from "../../../application/useCase/UserUseCase";
import { MyContext } from "../Server";
import { AuthContext } from "../context/AuthContext";

type InstallStationInput = {
    input: {
        name: string
        planet: string
    }
}

type RechargeInput = { input: Omit<CreateRechargeRequest, "userId"> }
type RegisterInput = { input: CreateUserRequest }
type LoginInput = { input: Omit<CreateUserRequest, "name"> }

export class MutationResolver {
    constructor(
        private readonly auth: AuthContext,
        private readonly appController: AppController
    ) { }

    private register = async (_: any, args: RegisterInput) => {
        const { name, email, password } = args.input
        const user = await this.appController.user.register({ name, email, password })
        return user
    }

    private login = async (_: any, args: LoginInput) => {
        const { email, password } = args.input
        const { token, user } = await this.appController.user.login({ email, password })
        return { token, user }
    }

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
            register: this.register,
            login: this.login,
            installStation: this.installStation,
            recharge: this.recharge
        }
    }
}