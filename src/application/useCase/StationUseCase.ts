import { IPlanetService } from "../service/IPlanetService";
import { IStationService } from "../service/IStationService";
import { IStation, Station } from "../entity/Station";

import { appErrors } from "../../error/Errors";
import { IPagination } from "../../utils/Type";

type StationResponse = Omit<IStation, "deletedAt">

export class StationUseCase {
    constructor(
        private readonly stationService: IStationService,
        private readonly planetService: IPlanetService
    ) { }

    protected static parseStation(station: IStation): StationResponse {
        return {
            id: station.id,
            name: station.name,
            charging: station.charging,
            planetId: station.planetId,
            createdAt: station.createdAt,
            updatedAt: station.updatedAt
        }
    }

    async create(stationName: string, planetName: string): Promise<StationResponse | null> {
        let station = await this.stationService.getByName(stationName)
        if (station) {
            throw new Error(appErrors.stationAlreadyExists)
        }
        const planet = await this.planetService.getByName(planetName)
        if (!planet) {
            throw new Error(appErrors.planetNotFound)
        }
        station = new Station({ name: stationName, planetId: planet.id })
        const stationResponse = await this.stationService.create(station)
        return StationUseCase.parseStation(stationResponse)
    }

    async list(pagination: IPagination): Promise<StationResponse[]> {
        const station = await this.stationService.list(pagination)
        return station.map(StationUseCase.parseStation)
    }

    async listByPlanet(planetId: string, pagination: IPagination): Promise<StationResponse[]> {
        const station = await this.stationService.listByPlanet(planetId, pagination)
        return station
    }

    async getById(id: string): Promise<StationResponse | null> {
        const station = await this.stationService.getById(id)
        if (!station) {
            throw new Error(appErrors.stationNotFound)
        }
        return station
    }
}