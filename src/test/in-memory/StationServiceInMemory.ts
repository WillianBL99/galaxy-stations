
import { IStation } from "../../application/entity/Station";
import { IStationService } from "../../application/service/IStationService";
import { IPagination } from "../../utils/Type";

export class StationServiceInMemory implements IStationService {
    stations: IStation[]
    constructor() {
        this.stations = []
    }
    async create(station: IStation): Promise<IStation> {
        this.stations.push(station)
        return station
    }
    async list(pagination: IPagination): Promise<IStation[]> {
        return this.stations
    }
    async getById(id: string): Promise<IStation | null> {
        return this.stations.find(station => station.id === id) || null
    }
    async getByName(name: string): Promise<IStation | null> {
        return this.stations.find(station => station.name === name) || null
    }
    async listByPlanet(planetId: String, pagination: IPagination): Promise<IStation[]> {
        return this.stations.filter(station => station.planetId === planetId) || null
    }
    async update(planet: IStation): Promise<IStation> {
        let founded = false
        this.stations = this.stations.map(p => {
            if (p.id === planet.id) {
                founded = true;
                return planet
            }
            return p
        })

        if (!founded) {
            throw new Error();
        }
        return planet
    }

}