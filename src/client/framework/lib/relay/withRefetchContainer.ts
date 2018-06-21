import { createRefetchContainer } from "react-relay";

// TODO: Add types.
export default (fragmentSpec, refetchQuery) => component =>
  createRefetchContainer(component, fragmentSpec, refetchQuery);
