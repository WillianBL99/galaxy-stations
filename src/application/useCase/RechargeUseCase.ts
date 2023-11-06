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
export type CreateReserveRequest = Pick<RechargeData, "startTime" | "endTime" | "stationId" | "userId">
export type RechargeResponse = Omit<IRecharge, "deletedAt">
export type ReserveResponse = { reservationId: string }

export class RechargeUseCase {
    constructor(
        private readonly rechargeService: IRechargeService,
        private readonly stationService: IStationService,
        private readonly userService: IUserService,
        private readonly appConfig: AppConfig
    ) { }

    async reserve({ stationId, userId, startTime, endTime }: CreateReserveRequest): Promise<ReserveResponse> {
        const recharge = new Recharge({
            userId,
            stationId,
            status: "reserved",
            startTime,
            endTime,
            pricePerMinute: this.appConfig.pricePerMinute,
        })
        this.validRechargeTimeInterval(recharge)

        const user = await this.userService.getById(userId)
        if (!user) {
            AppError.throw({ typeErr: "userNotFound" })
        }
        const station = await this.stationService.getById(stationId)
        if (!station) {
            AppError.throw({ typeErr: "stationNotFound" })
        }
        const usersSpacecraftCharging = await this.rechargeService
            .listByStatusAndUser("charging", userId, new Pagination({ active: false }))
        const filterRecharges = usersSpacecraftCharging.filter(uSC => (endTime.getTime() > uSC.startTime.getTime()) && startTime.getTime() < endTime.getTime())
        if (filterRecharges.length) {
            AppError.throw({ typeErr: "UserAlreadyChargingASpacecraft" })
        }

        await this.handleReservationConflict(recharge, stationId, userId, () => { })
        await this.rechargeService.create(recharge)
        return { reservationId: recharge.id }
    }

    async recharge({ endTime, stationId, userId }: CreateRechargeRequest): Promise<AppMessageType> {
        const user = await this.userService.getById(userId)
        if (!user) {
            AppError.throw({ typeErr: "userNotFound" })
        }
        const station = await this.stationService.getById(stationId)
        if (!station) {
            AppError.throw({ typeErr: "stationNotFound" })
        }
        const usersSpacecraftCharging = await this.rechargeService
            .listByStatusAndUser("charging", userId, new Pagination({ active: false }))
        if (usersSpacecraftCharging.length) {
            AppError.throw({ typeErr: "UserAlreadyChargingASpacecraft" })
        }

        const recharge = new Recharge({
            userId,
            stationId,
            status: "charging",
            startTime: new Date(),
            endTime: endTime,
            pricePerMinute: this.appConfig.pricePerMinute,
        })
        if (!RechargeUseCase.isAFutureTime(recharge.endTime, recharge.startTime)) {
            AppError.throw({ typeErr: "invalidEndTime" })
        }
        this.handleReserverStation(station)
        await this.rechargeService.create(recharge)
        const revert = async () => {
            this.stationService.update({ ...station, charging: false });
            this.rechargeService.delete(recharge.id)
        }
        await this.handleReservationConflict(recharge, stationId, userId, revert)
        this.whenFinishedDefineItAsDone(station, recharge)
        return AppInfo.get("chargingInProgress")
    }

    async getById(id: string): Promise<RechargeResponse | null> {
        const recharge = await this.rechargeService.getById(id)
        if (!recharge) {
            AppError.throw({ typeErr: "rechargeNotFound" })
        }
        return recharge
    }

    async listByStation(stationId: string, pagination: IPagination): Promise<RechargeResponse[]> {
        const status = "done"
        const recharge = await this.rechargeService.listByStatusAndStation(status, stationId, pagination)
        return recharge
    }

    async whenFinishedDefineItAsDone(station: IStation, recharge: IRecharge) {
        const spentTime = recharge.endTime.getTime() - new Date().getTime()
        setTimeout(() => {
            this.stationService.update({ ...station, charging: false })
            this.rechargeService.update({ ...recharge, status: "done" })
        }, spentTime);
    }

    protected validRechargeTimeInterval(recharge: IRecharge) {
        const currentDate = new Date();
        if (recharge.startTime <= currentDate || recharge.endTime <= currentDate) {
            AppError.throw({ typeErr: "invalidEndTime" })
        }
        if (recharge.startTime >= recharge.endTime) {
            AppError.throw({ typeErr: "invalidTimeInterval" })
        }
    }


    protected handleReserverStation(station: IStation): void {
        if (station.charging) {
            AppError.throw({ typeErr: "stationIsAlreadyCharging" })
        }
        this.stationService.update({ ...station, charging: true });
    }

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
        const pagination = new Pagination({ active: false });
        const [chargingRecharges, reservedRecharges] = await Promise.all([
            this.rechargeService.listByStatusAndStation("charging", stationId, pagination),
            this.rechargeService.listByStatusAndStation("reserved", stationId, pagination),
        ]);

        const recharges = [...chargingRecharges.filter(charge => charge.userId !== userId), ...reservedRecharges];

        if (this.conflictWithAnotherReservation(recharges, recharge.startTime, recharge.endTime)) {
            await callback();
            AppError.throw({ typeErr: "conflictTimeWithReservedCharge" });
        }
    }

    protected static isAFutureTime(endTime: Date, startTime: Date): boolean {
        return endTime.getTime() > startTime.getTime()
    }

    protected conflictWithAnotherReservation(reservations: IRecharge[], startTime: Date, endTime: Date): boolean {
        return !!reservations.find((reserve) => {
            const reservedStartTime = reserve.startTime
            const reservedEndTime = reserve.endTime
            if (RechargeUseCase.isAFutureTime(reservedEndTime, startTime)) {
                return endTime.getTime() > reservedStartTime.getTime();
            }
        });
    }
}
