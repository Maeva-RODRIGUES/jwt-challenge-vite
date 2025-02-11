import BookResolver from "./resolvers/book.resolver";
import UserResolver from "./resolvers/user.resolver";
import datasource from "./lib/datasource";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import Cookies from "cookies";
import { jwtVerify } from "jose";
import UserService from "./services/user.service";
import User from "./entities/user.entity";


import express from "express";
import http from "http";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
export interface MyContext {
  req: express.Request;
  res: express.Response;
  user: User | null;
}
export interface Payload {
  email: string;
}

const app = express();
const httpServer = http.createServer(app);

async function main() {
  const schema = await buildSchema({
    resolvers: [BookResolver, UserResolver],
    validate: false,
  });
  // const server = new ApolloServer({
  //   schema,
  // });
  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 4000 },
  // });
  await server.start();
  app.use(
    "/",
    cors<cors.CorsRequest>({ origin: "*" }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user: User | null = null;

        const cookies = new Cookies(req, res);
        const token = cookies.get("token");
        if (token) {
          try {
            const verify = await jwtVerify<Payload>(
              token,
              new TextEncoder().encode(process.env.SECRET_KEY)
            );
            user = await new UserService().findUserByEmail(
              verify.payload.email
            );
          } catch (err) {
            console.log(err);
            //potentiellement gérer l'erreur, est ce que l'erreur est liée au fait que le token soit expiré? est ce qu'on le renouvelle? ou est ce autre chose? etc...
          }
        }
        return { req, res, user };
      },
    })
  );

  await datasource.initialize();
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4005 }, resolve)
  );
  console.log(`🚀 Server lancé sur http://localhost:4005/`);
}

main();
