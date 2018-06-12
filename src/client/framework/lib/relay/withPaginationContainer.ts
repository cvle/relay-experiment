import { createPaginationContainer } from "react-relay";
export default (fragmentSpec, connectionConfig) => component =>
  createPaginationContainer(component, fragmentSpec, connectionConfig);
