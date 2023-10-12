import { beforeEach, describe, expect, it } from "vitest";
import { PlanetServiceInMemory } from "../../test/in-memory/PlanetServiceInMemory";
import { PlanetFactory } from "../../test/factory/PlanetFactory";
import { Pagination } from "../../utils/Type";
import { randomUUID } from "crypto";
import { PlanetUseCase } from "./PlanetUseCase";
import { AppError } from "../../error/Errors";
import { IPlanet } from "../entity/Planet";

class ProtectedMetods extends PlanetUseCase {
    static protectedParsePlanet(planet: IPlanet) {
        return PlanetUseCase.parsePlanet(planet)
    }
}

describe("Planet use cases", () => {
    describe("list", () => {
        let planetService: PlanetServiceInMemory
        let planetUseCase: PlanetUseCase
        beforeEach(() => {
            planetService = new PlanetServiceInMemory()
            planetUseCase = new PlanetUseCase(planetService)
        })
        it("should return a list of all planets", async () => {
            const qtdOfPlanets = 2
            planetService.planets = PlanetFactory.getPlanets(qtdOfPlanets)
            const pagination = new Pagination({ active: false })

            const result = await planetUseCase.list(pagination)
            expect(result).length(2)
        })
    })
    describe("getById", () => {
        let planetService: PlanetServiceInMemory
        let planetUseCase: PlanetUseCase
        beforeEach(() => {
            planetService = new PlanetServiceInMemory()
            planetUseCase = new PlanetUseCase(planetService)
        })
        it("should return a planet when pass a valid id", async () => {
            const qtdOfPlanets = 2
            planetService.planets = PlanetFactory.getPlanets(qtdOfPlanets)
            const planet = planetService.planets[0]

            const result = await planetUseCase.getById(planet.id)
            expect(result).toBeDefined()
            expect(result?.id).toEqual(planet.id)
            expect(result?.name).toEqual(planet.name)
        })
        it("should return an error when no planet are found by id", async () => {
            const call = async () => {
                await planetUseCase.getById(randomUUID())
            }
            expect(call()).rejects.toThrow("planetNotFound")
        })
    })
    describe("getByName", () => {
        let planetService: PlanetServiceInMemory
        let planetUseCase: PlanetUseCase
        beforeEach(() => {
            planetService = new PlanetServiceInMemory()
            planetUseCase = new PlanetUseCase(planetService)
        })
        it("should return a planet when pass a valid name", async () => {
            const qtdOfPlanets = 2
            planetService.planets = PlanetFactory.getPlanets(qtdOfPlanets)
            const planet = planetService.planets[0]

            const result = await planetUseCase.getByName(planet.name)
            expect(result).toBeDefined()
            expect(result?.id).toEqual(planet.id)
            expect(result?.name).toEqual(planet.name)
        })
        it("should return an error when no planet are found by name", async () => {
            const call = async () => {
                await planetUseCase.getByName("Invalid planet name")
            }
            expect(call()).rejects.toThrow("planetNotFound")
        })
    })
    describe("updateHasStation", () => {
        let planetService: PlanetServiceInMemory
        let planetUseCase: PlanetUseCase
        beforeEach(() => {
            planetService = new PlanetServiceInMemory()
            planetUseCase = new PlanetUseCase(planetService)
        })
        it("should return an updated planet when valid parameters and ID are provided", async () => {
            const qtdOfPlanets = 2
            planetService.planets = PlanetFactory.getPlanets(qtdOfPlanets)
            const planet = { ...planetService.planets[0] }

            const result = await planetUseCase.updateHasStation(planet.id, true)
            expect(result).toBeDefined()
            expect(result?.id).toEqual(planet.id)
            expect(result?.name).toEqual(planet.name)
            expect(result?.hasStation).toEqual(true)
        })
        it("should return an error when no planet are found by id", async () => {
            const call = async () => {
                await planetUseCase.updateHasStation(randomUUID(), true)
            }
            expect(call()).rejects.toThrow("planetNotFound")
        })
        it("should update the updatedAt property", async () => {
            const planet = PlanetFactory.getPlanet()
            planetService.planets.push(planet)

            const result = await planetUseCase.updateHasStation(planet.id, true)
            expect(result.id).to.equal(planet.id)
            expect(result.updatedAt).to.not.equal(planet.updatedAt)
        })
    })
    describe("parsePlanet", () => {
        it("should correctly parse a planet object", () => {
            const planet = PlanetFactory.getPlanet()

            const parsedPlanet = ProtectedMetods.protectedParsePlanet({ ...planet })
            expect(parsedPlanet).toEqual({ ...planet, deletedAt: undefined })
        })
    });

})