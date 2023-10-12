import { loadSchemaSync } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { ApolloServer, BaseContext } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { Resolvers } from "./resolvers"
import { App } from "../../application"
import { IUser } from "../../application/entity/User"
import { AuthContext, AuthContext } from "./context/AuthContext"

export type MyContext = {
    headers: {
        authorization: string,
    },
    user: Omit<IUser, "password">
};

export class GraphQLServer {
    private server: ApolloServer;

    constructor(private readonly app: App) {
        const typeDefs = loadSchemaSync("./src/infra/httpGraphQL/schemas/schema.gql", {
            loaders: [new GraphQLFileLoader()],
        });

        const auth = new AuthContext(this.app.controller.user, "secret")
        const resolvers = new Resolvers(auth, this.app).content();

        this.server = new ApolloServer<MyContext>({
            typeDefs,
            resolvers,
        });
    }

    async start() {
        const { url } = await startStandaloneServer(this.server, {
            listen: { port: 3000 },
            context: async ({ req, res }) => {
                console.log({ req: req.headers.authorization })
                return {
                    headers: req.headers
                }
            }
        });
        console.log(`🚀  Server ready at: ${url}`);
    }
}