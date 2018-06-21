import {
  ConnectionConfig,
  createPaginationContainer,
  GraphQLTaggedNode,
  RelayPaginationProp
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";

export default <T, InnerProps>(
  fragmentSpec: GraphQLTaggedNode,
  connectionConfig: ConnectionConfig<InnerProps>
): InferableComponentEnhancerWithProps<
  T & { relay: RelayPaginationProp },
  { [P in keyof T]: any }
> => (component: React.ComponentType<any>) =>
  createPaginationContainer(component, fragmentSpec, connectionConfig) as any;
