import { PrismaClient } from "@prisma/client";
import { App } from "../application";
import { GraphQLServer } from "./httpGraphQL/Server";

export class Infra {
    graphQL: GraphQLServer
    constructor(
        private readonly app: App
    ) {
        this.graphQL = new GraphQLServer(this.app)
    }
}