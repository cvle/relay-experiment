import * as React from "react";
import { compose, hoistStatics, InferableComponentEnhancer } from "recompose";
import { CSelector, CSnapshot, Environment } from "relay-runtime";

import { withContext } from "../bootstrap";

interface Props {
  relayEnvironment: Environment;
}

function withLocalStateContainer<T>(
  fragmentSpec: any
): InferableComponentEnhancer<{ local: T }> {
  return compose(
    withContext(({ relayEnvironment }) => ({ relayEnvironment })),
    hoistStatics((WrappedComponent: React.ComponentType<any>) => {
      class LocalStateContainer extends React.Component<Props, any> {
        constructor(props: Props) {
          super(props);
          const fragment = fragmentSpec.data().default;
          if (fragment.kind !== "Fragment") {
            throw new Error("Expected fragment");
          }
          if (fragment.type !== "Local") {
            throw new Error(
              `Type must be "Local" in "Fragment ${fragment.name}"`
            );
          }
          const selector: CSelector<any> = {
            dataID: "client:root.local",
            node: { selections: fragment.selections },
            variables: {}
          };
          const snapshot = props.relayEnvironment.lookup(selector);
          props.relayEnvironment.subscribe(snapshot, this.updateSnapshot);
          this.state = {
            data: snapshot.data
          };
        }

        private updateSnapshot = (snapshot: CSnapshot<any>) => {
          this.setState({ data: snapshot.data });
        };

        public render() {
          const { relayEnvironment: _, ...rest } = this.props;
          return <WrappedComponent {...rest} local={this.state.data} />;
        }
      }
      return LocalStateContainer as React.ComponentType<any>;
    })
  );
}

/**
 * createMutationContainer
 */
export default withLocalStateContainer;
