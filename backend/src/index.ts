import BookResolver from "./resolvers/book.resolver";
import UserResolver from "./resolvers/user.resolver";
import datasource from "./lib/datasource";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { customAuthChecker } from "./lib/authChecker";

import express from "express";
import http from "http";
import cors from "cors";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import Cookies from "cookies";
import User from "./entities/user.entity";
import { jwtVerify } from "jose";
import UserService from "./services/user.service";

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

// ✅ 1. Appliquer CORS avant tout autre middleware
app.use(
  cors({
    origin: ["http://localhost:5173/", "https://studio.apollograhql.com"], 
    credentials: true,
  })
);

// ✅ 2. Activer le parsing JSON
app.use(express.json());

async function main() {
  const schema = await buildSchema({
    resolvers: [BookResolver, UserResolver],
    validate: false,
    authChecker: customAuthChecker
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // ✅ 3. Appliquer le middleware Apollo après la configuration CORS et JSON
  app.use(
    "/",
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