import { faker } from "@faker-js/faker"
import { IRecharge, Recharge } from "../../application/entity/Recharge"
import { randomUUID } from "crypto"

export type RechargeMockData = Pick<IRecharge,
    "startTime" |
    "endTime" |
    "pricePerMinute" |
    "stationId" |
    "status" |
    "userId"
>

export class RechargeFactory {
    static getRecharges(qtd: number): IRecharge[] {
        const planets: IRecharge[] = []
        for (let i = 0; i < qtd; i++) {
            planets.push(this.getRecharge())
        }
        return planets
    }

    static getRecharge({
        status,
        startTime,
        endTime,
        pricePerMinute,
        stationId,
        userId
    }: Partial<RechargeMockData> = {}): IRecharge {
        startTime = startTime || new Date()
        const range = faker.number.int({min: 10, max: 50})
        endTime = endTime || new Date(startTime.getTime() + range)
        return new Recharge({
            status,
            startTime,
            endTime,
            pricePerMinute: pricePerMinute || faker.number.int({min: 10, max:50}),
            stationId: stationId || randomUUID(),
            userId: userId || randomUUID(),
        })
    }
}