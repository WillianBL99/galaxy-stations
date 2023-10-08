import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { loadSchemaSync } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import resolvers from "./resolvers"
const typeDefs = loadSchemaSync("./src/schema.gql", {loaders: [new GraphQLFileLoader]})

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

async function start(): Promise<void> {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 }
    })

    console.log(`🚀  Server ready at: ${url}`)
}
start()
