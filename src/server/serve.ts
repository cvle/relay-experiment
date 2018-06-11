import { ApolloServer, gql } from "apollo-server";
import { registerServer } from "apollo-server-express";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";

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
    comment: () => ({ id: 10, author: "Markus", body: "hey" }),
    comments: () => [
      { id: 10, author: "Markus", body: "Hey" },
      { id: 11, author: "Lukas", body: "What's up?" }
    ]
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
registerServer({ server, app, path: "/graphql" });

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`🚀 Server ready at ${APP_HOST}:${APP_PORT}`);
});
