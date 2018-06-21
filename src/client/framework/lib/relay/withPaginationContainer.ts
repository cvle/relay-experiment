import { createPaginationContainer } from "react-relay";
import { GraphQLTaggedNode } from "react-relay";

// TODO: Add types.
export default (
  fragmentSpec: GraphQLTaggedNode,
  connectionConfig
) => component =>
  createPaginationContainer(component, fragmentSpec, connectionConfig);
