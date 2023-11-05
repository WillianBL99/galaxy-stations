import { IRechargeService } from "../service/IRechargeService";
import { IRecharge, Recharge, RechargeData } from "../entity/Recharge";

import { IStationService } from "../service/IStationService";
import { IUserService } from "../service/IUserService";
import { IPagination, Pagination } from "../../utils/Type";
import { AppConfig } from "../../config/Config";
import { AppError } from "../../message/Errors";
import { IStation } from "../entity/Station";
import { AppMessageType } from "../../message/Message";
import { AppInfo } from "../../message/Info";

export type CreateRechargeRequest = Pick<RechargeData, "endTime" | "stationId" | "userId">
export type RechargeResponse = Omit<IRecharge, "deletedAt">

export class RechargeUseCase {
    constructor(
        private readonly rechargeService: IRechargeService,
        private readonly stationService: IStationService,
        private readonly userService: IUserService,
        private readonly appConfig: AppConfig
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
            createdAt: recharge.createdAt,
            updatedAt: recharge.updatedAt
        }
    }

    protected async handleReservationConflict(recharge: Recharge, stationId: string, userId: string, callback: () => any): Promise<void> {
        if (!RechargeUseCase.isAFutureTime(recharge.startTime, recharge.endTime)) {
            await callback()
            AppError.throw({typeErr: "invalidEndTime"})
        }
        const pagination = new Pagination({ active: false })
        const reservedRecharges = await this.rechargeService.listByStatusAndStation("reserved", stationId, pagination)

        if (this.conflictWithAnotherReservation(reservedRecharges, recharge.startTime, recharge.endTime)) {
            await callback()
            AppError.throw({typeErr: "conflictTimeWithReservedCharge"})
        }
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

    async recharge({ endTime, stationId, userId }: CreateRechargeRequest): Promise<AppMessageType> {
        const user = await this.userService.getById(userId)
        if (!user) {
            AppError.throw({typeErr: "userNotFound"})
        }
        const station = await this.stationService.getById(stationId)
        if (!station) {
            AppError.throw({typeErr: "stationNotFound"})
        }
        const usersSpacecraftCharging = await this.rechargeService
            .listByStatusAndUser("charging", userId, new Pagination({ active: false }))
        if (usersSpacecraftCharging.length) {
            AppError.throw({typeErr: "UserAlreadyChargingASpacecraft"})
        }

        this.handleReserverStation(station)
        const recharge = new Recharge({
            userId,
            stationId,
            status: "charging",
            startTime: new Date(),
            endTime: new Date(endTime),
            pricePerMinute: this.appConfig.pricePerMinute,
        })
        await this.rechargeService.create(recharge)
        const revert = () => {
            this.stationService.update({ ...station, charging: false });
            this.rechargeService.delete(recharge.id)
        }
        await this.handleReservationConflict(recharge, stationId, userId, revert)
        this.whenFinishedDefineItAsDone(station, recharge)
        return AppInfo.get("chargingInProgress")
    }

    whenFinishedDefineItAsDone(station: IStation, recharge: IRecharge) {
        const spentTime = recharge.endTime.getTime() - new Date().getTime()
        setTimeout(() => {
            this.stationService.update({ ...station, charging: false })
            this.rechargeService.update({ ...recharge, status: "done" })
        }, spentTime);
    }

    protected handleReserverStation(station: IStation): void {
        if (station.charging) {
            AppError.throw({typeErr: "stationIsAlreadyCharging"})
        }
        this.stationService.update({ ...station, charging: true });
    }

    async getById(id: string): Promise<RechargeResponse | null> {
        const recharge = await this.rechargeService.getById(id)
        if (!recharge) {
            AppError.throw({typeErr: "rechargeNotFound"})
        }
        return recharge
    }

    async listByStation(stationId: string, pagination: IPagination): Promise<RechargeResponse[]> {
        const status = "done"
        const recharge = await this.rechargeService.listByStatusAndStation(status, stationId, pagination)
        return recharge
    }
}
