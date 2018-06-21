import { createFragmentContainer, GraphQLTaggedNode } from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

export default <T>(
  fragmentSpec: GraphQLTaggedNode
): InferableComponentEnhancerWithProps<T, { [P in keyof T]: any }> => (
  component: React.ComponentType<any>
) => createFragmentContainer(component, fragmentSpec) as any;
