import { AppController } from "../../../application/controller";
type InstallStationInput = {
    input: {
        name: string
        planet: string
    }
}

export class MutationResolver {
    constructor(private readonly appController: AppController) { }

    private installStation = async (_: any, { input: { name, planet } }: InstallStationInput) => {
        const station = await this.appController.station.create({ stationName: name, planetName: planet })
        return station
    }

    content() {
        return {
            installStation: this.installStation
        }
    }
}