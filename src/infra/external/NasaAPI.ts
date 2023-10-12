import axios from "axios"
import JSONStream from "JSONStream"
import { Planet } from "../../application/entity/Planet"
import { PlanetPrismaService } from "../prisma/service/PlanetPrismaService"
import { AppService } from "../../application/service"

type PlanetNasa = {
    pl_name: string
    disc_year: number
    pl_bmassj: number
    sy_dist: number | null
}

export class NasaAPI {
    private count: number = 0
    static baseUrl = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    static format = "json"
    static query = {
        listSuitablePlanets: "select+pl_name,disc_year,pl_bmassj,sy_dist+from+ps+where+pl_bmassj>10"
    }

    constructor(private readonly appService: AppService) { }

    private parseUrl(query: string): string {
        return `${NasaAPI.baseUrl}?query=${query}&format=${NasaAPI.format}`
    }

    private async consume() {
        const url = this.parseUrl(NasaAPI.query.listSuitablePlanets)
        const response = await axios.get(url, { responseType: "stream" })
        return response.data
    }

    parserToPlanet = (jsonData: PlanetNasa) => {
        try {
            const planet = new Planet({
                name: jsonData.pl_name,
                mass: jsonData.pl_bmassj,
                hasStation: false,
            })
            this.appService.planet.upsert(planet)
        } catch (error) {
            if (error !instanceof PlanetPrismaService) {
                console.error(`Erro ao processar o JSON: ${error}`);
            }
        }
    }

    async restore() {
        console.log('Restoring...')
        const stream = await this.consume()
        const parser = JSONStream.parse('*')
        parser.on('data', this.parserToPlanet)
        parser.on('end', () => {
            console.log(`Planets restored`)
        })

        await stream.pipe(parser)
    }
    async handleRestore() {

    }
    async handleUpdate() {

    }
}