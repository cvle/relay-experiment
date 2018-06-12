import { createRefetchContainer } from "react-relay";
export default (fragmentSpec, refetchQuery) => component =>
  createRefetchContainer(component, fragmentSpec, refetchQuery);
