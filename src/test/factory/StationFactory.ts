import { faker } from "@faker-js/faker"
import { IStation, Station } from "../../application/entity/Station"
import { randomUUID } from "crypto"

export type StationMockData = Pick<IStation, "charging" | "planetId">
export class StationFactory {
    static getStations(qtd: number): IStation[] {
        const planets: IStation[] = []
        for (let i = 0; i < qtd; i++) {
            planets.push(this.getStation())
        }
        return planets
    }

    static getStation({ charging, planetId }: Partial<StationMockData> = {}): IStation {
        return new Station({
            name: faker.company.name(),
            charging: charging ?? false,
            planetId: planetId ?? randomUUID(),
        })
    }
}