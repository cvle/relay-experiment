import { createFragmentContainer, GraphQLTaggedNode } from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

export default <T>(
  fragmentSpec: GraphQLTaggedNode
): InferableComponentEnhancerWithProps<{ data: T }, { data: any }> => (
  component: React.ComponentType<any>
) => createFragmentContainer<T>(component, fragmentSpec) as any;
