import { IRechargeService } from "../service/IRechargeService";
import { IRecharge, Recharge, RechargeData } from "../entity/Recharge";
import { UUID } from "crypto";
import { IStationService } from "../service/IStationService";
import { IUserService } from "../service/IUserService";
import { IPagination, Pagination } from "../../utils/Type";
import { IAppConfig } from "../../config/Config";
import { appErrors } from "../../error/Errors";
import { IStation } from "../entity/Station";

type CreateUserRequest = Pick<RechargeData, "endTime" | "stationId" | "userId">
type RechargeResponse = Omit<IRecharge, "deletedAt">

export class RechargeUseCase {
    constructor(
        private readonly rechargeService: IRechargeService,
        private readonly stationService: IStationService,
        private readonly userService: IUserService,
        private readonly appConfig: IAppConfig
    ) { }

    protected static parseRecharge(recharge: IRecharge): RechargeResponse {
        return {
            id: recharge.id,
            status: recharge.status,
            pricePerMinute: recharge.pricePerMinute,
            startTime: recharge.startTime,
            endTime: recharge.endTime,
            userId: recharge.userId,
            stationId: recharge.stationId,
            cratedAt: recharge.cratedAt,
            updatedAt: recharge.updatedAt
        }
    }

    protected async handleReservationConflict(recharge: Recharge, stationId: UUID, userId: UUID, callback: () => any): Promise<void> {
        if (!RechargeUseCase.isAFutureTime(recharge.startTime, recharge.endTime)) {
            await callback()
            throw new Error(appErrors.invalidEndTime)
        }
        const pagination = new Pagination({ active: false })


        const reservedRecharges = await this.rechargeService.listByStatusAndStation("reserved", stationId, pagination)

        if (this.conflictWithAnotherReservation(reservedRecharges, recharge.startTime, recharge.endTime)) {
            await callback()
            throw new Error(appErrors.conflictTimeWithReservedCharge)
        }

        const spendTime = recharge.endTime.getTime() - recharge.startTime.getTime()
        await new Promise((resolve) => setTimeout(resolve, spendTime))
    }

    protected static isAFutureTime(startTime: Date, endTime: Date): boolean {
        return endTime.getTime() > startTime.getTime()
    }

    protected conflictWithAnotherReservation(reservations: IRecharge[], startTime: Date, endTime: Date): boolean {
        return !!reservations.find((reserve) => {
            const reservedStartTime = reserve.startTime
            const reservedEndTime = reserve.endTime
            if (RechargeUseCase.isAFutureTime(startTime, reservedEndTime)) {
                return endTime.getTime() > reservedStartTime.getTime();
            }
        });
    }

    async recharge({ endTime, stationId, userId }: CreateUserRequest): Promise<RechargeResponse> {
        const user = await this.userService.getById(userId)
        if (!user) {
            throw new Error(appErrors.userNotFound)
        }
        const station = await this.stationService.getById(stationId)
        if (!station) {
            throw new Error(appErrors.stationNotFound)
        }
        const usersSpacecraftCharging = await this.rechargeService
            .listByStatusAndUser("charging", userId, new Pagination({ active: false }))
        if (usersSpacecraftCharging.length) {
            throw new Error(appErrors.UserAlreadyChargingASpacecraft)
        }

        this.reserveStationForCharging(station)
        const recharge = new Recharge({
            userId,
            endTime,
            stationId,
            status: "charging",
            startTime: new Date(),
            pricePerMinute: this.appConfig.pricePerMinute,
        })
        await this.rechargeService.create(recharge)
        const revert = () => {
            this.releaseStationFromCharging(station)
            this.rechargeService.delete(recharge.id)
        }
        await this.handleReservationConflict(recharge, stationId, userId, revert)

        const rechargeResponse = await this.rechargeService.update({ ...recharge, status: "done" })
        await this.releaseStationFromCharging(station)
        return RechargeUseCase.parseRecharge(rechargeResponse)
    }

    protected reserveStationForCharging(station: IStation): void {
        if (station.charging) {
            throw new Error(appErrors.stationIsAlreadyCharging);
        }
        this.stationService.update({ ...station, charging: true });
    }

    protected async releaseStationFromCharging(station: IStation): Promise<void> {
        await this.stationService.update({ ...station, charging: false });
    }

    async getById(id: UUID): Promise<RechargeResponse | null> {
        const recharge = await this.rechargeService.getById(id)
        if (!recharge) {
            throw new Error(appErrors.rechargeNotFound)
        }
        return recharge
    }

    async listByStation(stationId: UUID, pagination: IPagination): Promise<RechargeResponse[]> {
        const status = "done"
        const recharge = await this.rechargeService.listByStatusAndStation(status, stationId, pagination)
        return recharge
    }
}