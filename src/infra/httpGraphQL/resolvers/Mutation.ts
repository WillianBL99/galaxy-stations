import { AppController } from "../../../application/controller";
import { CreateUserRequest } from "../../../application/useCase/UserUseCase";
import { AppError } from "../../../message/Errors";
import { HandleDate } from "../../../utils/HandleDate";
import { MyContext } from "../Server";
import { AuthContext } from "../context/AuthContext";

type InstallStationInput = {
    input: {
        name: string
        planet: string
    }
}

type RechargeInput = { input: { endTime: string, stationId: string, reservationId: string } }
type ReserveInput = { input: { startTime: string, endTime: string, stationId: string } }
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
        const timezone = context?.headers?.timezone
        const { stationId, endTime, reservationId } = args.input
        if (reservationId) {
            const result = await this.appController.recharge.rechargeReserve({ reservationId })
            return { message: result.message }
        }

        if (stationId && endTime) {
            const result = await this.appController.recharge.recharge({
                userId: data.userId,
                stationId,
                endTime: HandleDate.convertToUTC(endTime, timezone)
            })
            return { message: result.message }
        }

        AppError.throw({typeErr: "invalidRechargeRequest"})
    }

    private reservation = async (_: any, args: ReserveInput, context: MyContext) => {
        const data = await this.auth.validateToken(context?.headers?.authorization)
        const timezone = context?.headers?.timezone
        const { stationId, startTime, endTime } = args.input
        const result = await this.appController.recharge.reserve({
            stationId,
            userId: data.userId,
            startTime: HandleDate.convertToUTC(startTime, timezone),
            endTime: HandleDate.convertToUTC(endTime, timezone)
        })

        return result
    }

    content() {
        return {
            register: this.register,
            login: this.login,
            installStation: this.installStation,
            recharge: this.recharge,
            reservation: this.reservation,
        }
    }
}