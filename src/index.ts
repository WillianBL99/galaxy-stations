import { PrismaClient } from "@prisma/client";
import { Infra } from "./infra";
import { App } from "./application";
import { NasaAPI } from "./infra/external/NasaAPI";

const prismaClient = new PrismaClient()
const app = new App(prismaClient)
const infra = new Infra(app)
infra.graphQL.start()
const d = new Date()
const external = new NasaAPI(app.service)
external.restore()