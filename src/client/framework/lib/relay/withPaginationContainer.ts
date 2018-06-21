import { createPaginationContainer } from "react-relay";

// TODO: Add types.
export default (fragmentSpec, connectionConfig) => component =>
  createPaginationContainer(component, fragmentSpec, connectionConfig);
