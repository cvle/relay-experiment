import { createFragmentContainer } from "react-relay";
export default fragmentSpec => component =>
  createFragmentContainer(component, fragmentSpec);
