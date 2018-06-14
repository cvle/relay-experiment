import { ApolloServer, gql } from "apollo-server";
import { registerServer } from "apollo-server-express";
import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const APP_PORT = 3000;
const APP_HOST = "0.0.0.0";

const app = express();

// Serve static resources
app.use("/", express.static(path.resolve(__dirname, "../../dist")));

const schema = fs.readFileSync(
  path.join(__dirname, "../schema.graphql"),
  "utf8"
);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  ${schema}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    comment: () => ({ id: uuid(), author: "Markus", body: "hey" }),
    comments: () => [
      { id: uuid(), author: "Markus", body: "Hey" },
      { id: uuid(), author: "Lukas", body: "What's up?" }
    ]
  },
  Mutation: {
    postComment: (_, { input: { body, clientMutationId } }) => ({
      comment: { id: uuid(), author: "You", body },
      clientMutationId
    })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
registerServer({ server, app, path: "/graphql" });

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`🚀 Server ready at ${APP_HOST}:${APP_PORT}`);
});
