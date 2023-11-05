import { beforeEach, describe, expect, it, vi, } from "vitest"
import { RechargeServiceInMemory } from "../../test/in-memory/RechargeServiceInMemory"
import { RechargeUseCase } from "./RechargeUseCase"
import { StationServiceInMemory } from "../../test/in-memory/StationServiceInMemory"
import { UserServiceInMemory } from "../../test/in-memory/UserServiceInMemory"
import { AppConfig } from "../../config/Config"
import { IUser } from "../entity/User"
import { UserFactory } from "../../test/factory/UserFactory"
import { randomUUID } from "crypto"
import { IStation } from "../entity/Station"
import { StationFactory } from "../../test/factory/StationFactory"
import { AppError } from "../../message/Errors"
import { IRecharge, Recharge } from "../entity/Recharge"
import { RechargeFactory } from "../../test/factory/RechargeFactory"
import { Pagination } from "../../utils/Type"
import { AppInfo } from "../../message/Info"

class Config implements AppConfig {
    pricePerMinute: number
    timeToUpdate: number
    port: number
    constructor(pricePerMinute: number) {
        this.pricePerMinute = pricePerMinute
        this.timeToUpdate = 1000
        this.port = 3000
    }
}

class ProtectedMetods extends RechargeUseCase {
    static protectedParseRecharge(recharge: IRecharge) {
        return this.parseRecharge(recharge)
    }
    protectedHandleConflict(recharge: IRecharge, stationId: string, userId: string, callback: () => void) {
        return this.handleReservationConflict(recharge, stationId, userId, callback)
    }
    static protectedIsAFutureTime(startTime: Date, endTime: Date) {
        return RechargeUseCase.isAFutureTime(startTime, endTime)
    }
    protectedConflictWithFutureReservations(reservations: IRecharge[], startTime: Date, endTime: Date) {
        return this.conflictWithAnotherReservation(reservations, startTime, endTime)
    }
}

describe("Recharge use cases", () => {
    describe("should return an error when passed a invalid user id", () => {
        let rechargeService: RechargeServiceInMemory
        let stationService: StationServiceInMemory
        let rechargeUseCase: RechargeUseCase
        let appConfig: AppConfig
        let userService: UserServiceInMemory
        let station: IStation
        beforeEach(() => {
            rechargeService = new RechargeServiceInMemory()
            stationService = new StationServiceInMemory()
            userService = new UserServiceInMemory()
            const pricePerMinute = 4
            appConfig = new Config(pricePerMinute)
            rechargeUseCase = new RechargeUseCase(
                rechargeService,
                stationService,
                userService,
                appConfig
            )
            station = StationFactory.getStation()
            stationService.stations.push(station)
        })
        it("recharge", async () => {
            const expectedDuration = 1000 // milliseconds
            const endTime = new Date(new Date().getTime() + expectedDuration)

            const call = async () => {

            }
            await expect(async () => {
                await rechargeUseCase.recharge({
                    userId: randomUUID(),
                    stationId: station.id,
                    endTime
                })
            }).rejects.toThrow("userNotFound")
        })
    })
    describe("when pass a valid user id", () => {
        let userService: UserServiceInMemory
        let user: IUser
        beforeEach(() => {
            userService = new UserServiceInMemory()
            user = UserFactory.getUser()
            userService.users.push(user)
        })
        describe("recharge", () => {
            let rechargeService: RechargeServiceInMemory
            let stationService: StationServiceInMemory
            let rechargeUseCase: RechargeUseCase
            let appConfig: AppConfig
            let station: IStation
            beforeEach(() => {
                rechargeService = new RechargeServiceInMemory()
                stationService = new StationServiceInMemory()
                const pricePerMinute = 4
                appConfig = new Config(pricePerMinute)
                rechargeUseCase = new RechargeUseCase(
                    rechargeService,
                    stationService,
                    userService,
                    appConfig
                )
                station = StationFactory.getStation()
                stationService.stations.push(station)
            })
            it("should return 'recharge in progress' when valid station and datetime are provided", async () => {
                const expectedDuration = 50 // milliseconds
                const startTime = new Date()
                const endTime = new Date(startTime.getTime() + expectedDuration)

                const result = await rechargeUseCase.recharge({
                    userId: user.id,
                    stationId: station.id,
                    endTime
                })
                const duration = Date.now() - startTime.getTime()

                expect(result.message).to.equal(AppInfo.message.chargingInProgress?.message)
            })
            it("should create a recharge when provided with a valid station and a valid datetime", async () => {
                const maxLatency = 60 // milliseconds
                const duration = 50 // milliseconds
                const maxDuration = duration + maxLatency
                const startTime = new Date()
                const endTime = new Date(startTime.getTime() + duration)

                const result = await rechargeUseCase.recharge({
                    userId: user.id,
                    stationId: station.id,
                    endTime
                })
                await new Promise<void>((resolve) => setTimeout(() => resolve(), maxDuration))

                expect(result.message).to.equal(AppInfo.message.chargingInProgress?.message)
                expect(rechargeService.recharges).length(1)
            })
            it("should not create a recharge when the station is not found", async () => {
                const expectedDuration = 50 // milliseconds
                const endTime = new Date(new Date().getTime() + expectedDuration)
                stationService.stations[0].charging = true

                await expect(async () => {
                    await rechargeUseCase.recharge({
                        userId: user.id,
                        stationId: randomUUID(),
                        endTime
                    })
                }).rejects.toThrow("stationNotFound")
                expect(rechargeService.recharges).length(0)
            })
            it("should not create a recharge when the station is already charging", async () => {
                const expectedDuration = 50 // milliseconds
                const endTime = new Date(new Date().getTime() + expectedDuration)
                stationService.stations[0].charging = true

                await expect(async () => {
                    await rechargeUseCase.recharge({
                        userId: user.id,
                        stationId: station.id,
                        endTime
                    })
                }).rejects.toThrow("stationIsAlreadyCharging")
                expect(rechargeService.recharges).length(0)
            })
            it("should create a recharge when not conflict with a reserved recharge", async () => {
                const expectedDuration = 50 // milliseconds
                const endTime = new Date(new Date().getTime() + expectedDuration)
                const reservedRecharge = RechargeFactory.getRecharge({
                    userId: user.id,
                    stationId: station.id,
                    startTime: endTime,
                    status: "reserved"
                })
                rechargeService.recharges.push(reservedRecharge)

                const result = await rechargeUseCase.recharge({
                    userId: user.id,
                    stationId: station.id,
                    endTime
                })
                expect(result.message).to.be.equal(AppInfo.message.chargingInProgress?.message)
                expect(rechargeService.recharges).length(2)
            })
            it("should not create a recharge when conflict with a reserved recharge", async () => {
                const expectedDuration = 50 // milliseconds
                const endTime = new Date(new Date().getTime() + expectedDuration)
                const reservedRecharge = RechargeFactory.getRecharge({
                    userId: user.id,
                    stationId: station.id,
                    startTime: new Date(endTime.getTime() - 1),
                    status: "reserved"
                })
                rechargeService.recharges.push(reservedRecharge)

                await expect(async () => {
                    await rechargeUseCase.recharge({
                        userId: user.id,
                        stationId: station.id,
                        endTime
                    })
                }).rejects.toThrow("conflictTimeWithReservedCharge")
                expect(rechargeService.recharges).length(1)
            })
            it("should return an error when a user tries to initiate two recharges simultaneously in two stations", async () => {
                const startTime = new Date()
                const expectedDuration = 1000 // milliseconds
                const endTime = new Date(startTime.getTime() + expectedDuration)
                const station2 = StationFactory.getStation()
                stationService.stations.push(station2)
                const recharge1 = RechargeFactory.getRecharge({ userId: user.id, stationId: station.id, startTime, endTime })
                const recharge2 = RechargeFactory.getRecharge({ userId: user.id, stationId: station2.id, startTime, endTime })
                rechargeService.recharges.push({ ...recharge2, status: "charging" })

                expect(await rechargeService.listByStatusAndUser("charging", user.id, new Pagination({ active: false }))).length(1)

                await expect(async () => {
                    const results = []
                    results.push(rechargeUseCase.recharge(recharge1))
                    results.push(rechargeUseCase.recharge(recharge2))
                    await Promise.all(results)
                }).rejects.toThrow("UserAlreadyChargingASpacecraft")
                expect(rechargeService.recharges).length(1)
            })
            it("should return an error when pass a invalid end time", async () => {
                const expectedDuration = 50 // milliseconds
                const startTime = new Date(new Date().getTime() - 1000)
                const endTime = new Date(startTime.getTime() + expectedDuration)

                await expect(async () => {
                    await rechargeUseCase.recharge({
                        userId: user.id,
                        stationId: station.id,
                        endTime
                    })
                }).rejects.toThrow("invalidEndTime")
                expect(rechargeService.recharges).length(0)
            })
        })
        describe("getById", () => {
            let rechargeService: RechargeServiceInMemory
            let stationService: StationServiceInMemory
            let rechargeUseCase: RechargeUseCase
            let appConfig: AppConfig
            beforeEach(() => {
                rechargeService = new RechargeServiceInMemory()
                stationService = new StationServiceInMemory()
                const pricePerMinute = 4
                appConfig = new Config(pricePerMinute)
                rechargeUseCase = new RechargeUseCase(
                    rechargeService,
                    stationService,
                    userService,
                    appConfig
                )
            })
            it("should return a recharge when pass a valid id", async () => {
                const qtdOfPlanets = 2
                rechargeService.recharges = RechargeFactory.getRecharges(qtdOfPlanets)
                const recharge = rechargeService.recharges[0]

                const result = await rechargeUseCase.getById(recharge.id)
                expect(result).toBeDefined()
                expect(result?.id).to.be.equal(recharge.id)
                expect(result?.endTime).to.be.equal(recharge.endTime)
            })
            it("should return an error when no planet are found by id", async () => {
                await expect(async () => {
                    await rechargeUseCase.getById(randomUUID())
                }).rejects.toThrow("rechargeNotFound")
            })
        })
        describe("listByStation", () => {
            let rechargeService: RechargeServiceInMemory
            let stationService: StationServiceInMemory
            let rechargeUseCase: RechargeUseCase
            let appConfig: AppConfig
            let station: IStation
            beforeEach(() => {
                rechargeService = new RechargeServiceInMemory()
                stationService = new StationServiceInMemory()
                const pricePerMinute = 4
                appConfig = new Config(pricePerMinute)
                rechargeUseCase = new RechargeUseCase(
                    rechargeService,
                    stationService,
                    userService,
                    appConfig
                )
                station = StationFactory.getStation()
                stationService.stations.push(station)
            })
            it("should return a list of recharge when pass a valid station", async () => {
                const qtdOfPlanets = 2
                rechargeService.recharges = RechargeFactory.getRecharges(qtdOfPlanets)
                const recharge = RechargeFactory.getRecharge({
                    stationId: station.id
                })
                rechargeService.recharges.push(recharge)

                const result = await rechargeUseCase.listByStation(station.id, new Pagination({ active: false }))
                expect(result).length(1)
                expect(result[0].id).to.be.equal(recharge.id)
                expect(result[0].endTime).to.be.equal(recharge.endTime)
            })
            it("should not return a list of recharge when pass a invalid station", async () => {
                const qtdOfPlanets = 2
                rechargeService.recharges = RechargeFactory.getRecharges(qtdOfPlanets)

                const result = await rechargeUseCase.listByStation(station.id, new Pagination({ active: false }))
                expect(result).length(0)
            })
        })
        describe("parseRecharge", () => {
            it("should correctly parse a recharg object", () => {
                const recharge = RechargeFactory.getRecharge()

                const parsedPlanet = ProtectedMetods.protectedParseRecharge({ ...recharge })
                expect(parsedPlanet).toEqual({ ...recharge, deletedAt: undefined })
            })
        })
        describe("handleConflict", () => {
            let rechargeService: RechargeServiceInMemory
            let stationService: StationServiceInMemory
            let rechargeUseCase: ProtectedMetods
            let appConfig: AppConfig
            let station: IStation
            beforeEach(() => {
                rechargeService = new RechargeServiceInMemory()
                stationService = new StationServiceInMemory()
                const pricePerMinute = 4
                appConfig = new Config(pricePerMinute)
                rechargeUseCase = new ProtectedMetods(
                    rechargeService,
                    stationService,
                    userService,
                    appConfig
                )
                station = StationFactory.getStation()
                stationService.stations.push(station)
            })
            it("should throw an error for invalid end time and execute the callback", async () => {
                const startTime = Date.now()
                const recharge = RechargeFactory.getRecharge({
                    startTime: new Date(startTime),
                    endTime: new Date(startTime - 1)
                })
                const callback = vi.fn()

                await expect(async () => {
                    await rechargeUseCase.protectedHandleConflict(recharge, station.id, user.id, callback)
                }).rejects.toThrow("invalidEndTime")
                expect(callback).toBeCalledTimes(1)
            })

            it("should throw an error for time conflict with reserved charge and execute the callback", async () => {
                const startTime = Date.now()
                const reservedRecharge = RechargeFactory.getRecharge({
                    status: "reserved",
                    stationId: station.id,
                    startTime: new Date(startTime),
                })
                const recharge = RechargeFactory.getRecharge({
                    endTime: new Date(startTime + 5),
                })
                rechargeService.recharges.push(reservedRecharge, recharge)
                const callback = vi.fn()

                await expect(async () => {
                    await rechargeUseCase.protectedHandleConflict(recharge, station.id, user.id, callback)
                }).rejects.toThrow("conflictTimeWithReservedCharge")
                expect(callback).toBeCalledTimes(1)
            })
        })
        describe("isAFutureTime", () => {
            it("should return true for endTime later than startTime", () => {
                const startTime = new Date();
                const endTime = new Date(startTime.getTime() + 10);
                const result = ProtectedMetods.protectedIsAFutureTime(startTime, endTime);
                expect(result).toBe(true);
            });

            it("should return false for endTime equal to startTime", () => {
                const startTime = new Date();
                const endTime = startTime;
                const result = ProtectedMetods.protectedIsAFutureTime(startTime, endTime);
                expect(result).toBe(false);
            });

            it("should return false for endTime earlier than startTime", () => {
                const startTime = new Date();
                const endTime = new Date(startTime.getTime() - 10);
                const result = ProtectedMetods.protectedIsAFutureTime(startTime, endTime);
                expect(result).toBe(false);
            });
        })
    })
})