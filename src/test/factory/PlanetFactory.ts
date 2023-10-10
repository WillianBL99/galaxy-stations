import { faker } from "@faker-js/faker"
import { IPlanet, Planet } from "../../application/entity/Planet"

export class PlanetFactory {
    static getPlanets(qtd: number): IPlanet[] {
        const planets: IPlanet[] = []
        for (let i = 0; i < qtd; i++) {
            planets.push(this.getPlanet())
        }
        return planets
    }

    static getPlanet(): IPlanet {
        return new Planet({
            name: faker.science.chemicalElement().name,
            hasStation: false,
        })
    }
}