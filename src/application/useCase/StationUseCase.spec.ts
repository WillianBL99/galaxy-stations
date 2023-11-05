import { beforeEach, describe, expect, it } from "vitest";
import { StationUseCase } from "./StationUseCase";
import { StationServiceInMemory } from "../../test/in-memory/StationServiceInMemory";
import { PlanetServiceInMemory } from "../../test/in-memory/PlanetServiceInMemory";
import { IPlanet } from "../entity/Planet";
import { PlanetFactory } from "../../test/factory/PlanetFactory";
import { StationFactory } from "../../test/factory/StationFactory";
import { AppError } from "../../message/Errors";
import { IStation } from "../entity/Station";
import { Pagination } from "../../utils/Type";
import { randomUUID } from "crypto";

class ProtectedMetods extends StationUseCase {
    static protectedParseStation(station: IStation) {
        return StationUseCase.parseStation(station)
    }
}

describe("Station use cases", () => {
    describe("create", () => {
        let stationUseCase: StationUseCase
        let planetService: PlanetServiceInMemory
        let stationService: StationServiceInMemory
        let planet: IPlanet
        beforeEach(() => {
            stationService = new StationServiceInMemory()
            planetService = new PlanetServiceInMemory()
            stationUseCase = new StationUseCase(
                stationService,
                planetService
            )
            planet = PlanetFactory.getPlanet()
            planetService.planets.push(planet)
        })
        it("should create a new station when it does not already exist", async () => {
            const result = await stationUseCase.create({ stationName: "station", planetName: planet.name })

            expect(result?.name).to.equal("station")
            expect(result?.planetId).to.equal(planet.id)
        });

        it("should throw an error if a station with the same name already exists", async () => {
            const station = StationFactory.getStation({ planetId: planet.id });
            stationService.stations.push(station)

            await expect(async () => {
                await stationUseCase.create({ planetName: planet.name, stationName: station.name })
            }).rejects.toThrow("stationAlreadyExists")
        });

        it("should throw an error if the planet does not exist", async () => {
            await expect(async () => {
                await stationUseCase.create({ stationName: "station", planetName: "inexistent-planet" })
            }).rejects.toThrow("planetNotFound")
        });
    })
    describe("list", () => {
        let stationUseCase: StationUseCase
        let planetService: PlanetServiceInMemory
        let stationService: StationServiceInMemory
        let planet: IPlanet
        beforeEach(() => {
            stationService = new StationServiceInMemory()
            planetService = new PlanetServiceInMemory()
            stationUseCase = new StationUseCase(
                stationService,
                planetService
            )
            planet = PlanetFactory.getPlanet()
            planetService.planets.push(planet)
        })
        it("should return a list of all planets", async () => {
            const qtdOfStation = 2
            stationService.stations = StationFactory.getStations(qtdOfStation)
            const pagination = new Pagination({ active: false })

            const result = await stationUseCase.list(pagination)
            expect(result).length(2)
        })
    })
    describe("listByPlanet", () => {
        let stationUseCase: StationUseCase
        let planetService: PlanetServiceInMemory
        let stationService: StationServiceInMemory
        let planet: IPlanet
        beforeEach(() => {
            stationService = new StationServiceInMemory()
            planetService = new PlanetServiceInMemory()
            stationUseCase = new StationUseCase(
                stationService,
                planetService
            )
            planet = PlanetFactory.getPlanet()
            planetService.planets.push(planet)
        })
        it("should return a list of stations when pass a valid planet", async () => {
            const qtdOfStations = 2
            stationService.stations = StationFactory.getStations(qtdOfStations)
            const station = StationFactory.getStation({
                planetId: planet.id
            })
            stationService.stations.push(station)

            const result = await stationUseCase.listByPlanet(planet.id, new Pagination({ active: false }))
            expect(result).length(1)
            expect(result[0].id).to.be.equal(station.id)
            expect(result[0].name).to.be.equal(station.name)
        })
        it("should not return a list of stations when pass a invalid planet", async () => {
            const qtdOfStations = 2
            stationService.stations = StationFactory.getStations(qtdOfStations)

            const result = await stationUseCase.listByPlanet(planet.id, new Pagination({ active: false }))
            expect(result).length(0)
        })
    })
    describe("getById", () => {
        let stationUseCase: StationUseCase
        let planetService: PlanetServiceInMemory
        let stationService: StationServiceInMemory
        let planet: IPlanet
        beforeEach(() => {
            stationService = new StationServiceInMemory()
            planetService = new PlanetServiceInMemory()
            stationUseCase = new StationUseCase(
                stationService,
                planetService
            )
            planet = PlanetFactory.getPlanet()
            planetService.planets.push(planet)
        })
        it("should return a station when pass a valid id", async () => {
            const qtdOfPlanets = 2
            stationService.stations = StationFactory.getStations(qtdOfPlanets)
            const recharge = stationService.stations[0]

            const result = await stationUseCase.getById(recharge.id)
            expect(result).toBeDefined()
            expect(result?.id).to.be.equal(recharge.id)
            expect(result?.name).to.be.equal(recharge.name)
        })
        it("should return an error when the station is not found by id", async () => {
            await expect(async () => {
                await stationUseCase.getById(randomUUID())
            }).rejects.toThrow("stationNotFound")
        })
    })
    describe("parseStation", () => {
        it("", async () => {
            it("should correctly parse a recharg object", () => {
                const station = StationFactory.getStation()

                const parsedPlanet = ProtectedMetods.protectedParseStation({ ...station })
                expect(parsedPlanet).toEqual({ ...station, deletedAt: undefined })
            })
        })
    })
})