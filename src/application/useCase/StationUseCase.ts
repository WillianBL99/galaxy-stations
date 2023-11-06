import { IPlanetService } from "../service/IPlanetService";
import { IStationService } from "../service/IStationService";
import { IStation, Station } from "../entity/Station";

import { AppError } from "../../message/Errors";
import { IPagination } from "../../utils/Type";

export type StationResponse = Omit<IStation, "deletedAt">
export type CreateStationData = {
    stationName: string
    planetName: string
}

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

    async create({ stationName, planetName }: CreateStationData): Promise<StationResponse> {
        let station = await this.stationService.getByName(stationName)
        if (station) {
            AppError.throw({ typeErr: "stationAlreadyExists" })
        }
        const planet = await this.planetService.getByName(planetName)
        if (!planet) {
            AppError.throw({ typeErr: "planetNotFound" })
        }
        station = new Station({ name: stationName, planetId: planet.id })
        const stationResponse = await this.stationService.create(station)
        this.planetService.update({ ...planet, hasStation: true })
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
            AppError.throw({ typeErr: "stationNotFound" })
        }
        return station
    }
}