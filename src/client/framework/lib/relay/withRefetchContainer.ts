import { createRefetchContainer } from "react-relay";
import { GraphQLTaggedNode } from "react-relay";

// TODO: Add types.
export default (fragmentSpec: GraphQLTaggedNode, refetchQuery) => component =>
  createRefetchContainer(component, fragmentSpec, refetchQuery);
