import { loadSchemaSync } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { Resolvers } from "./resolvers"
import { App } from "../../application"

export class GraphQLServer {
    private server: ApolloServer
    constructor(private readonly app: App) {
        const typeDefs = loadSchemaSync("./src/infra/httpGraphQL/schemas/schema.gql", {
            loaders: [new GraphQLFileLoader]
        })
        const resolvers = new Resolvers(app).content()

        this.server = new ApolloServer({
            typeDefs,
            resolvers
        })
    }

    async start() {
        const { url } = await startStandaloneServer(this.server, {
            listen: { port: 3000 }
        })
        console.log(`🚀  Server ready at: ${url}`)
    }
}
