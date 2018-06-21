import * as React from "react";
import { compose, hoistStatics, InferableComponentEnhancer } from "recompose";
import { Environment } from "relay-runtime";

import { withContext } from "../bootstrap";

function createMutationContainer<T extends string, I, R>(
  propName: T,
  commit: (environment: Environment, input: I) => Promise<R>
): InferableComponentEnhancer<{ [P in T]: (input: I) => Promise<R> }> {
  return compose(
    withContext(({ relayEnvironment }) => ({ relayEnvironment })),
    hoistStatics((WrappedComponent: React.ComponentType<any>) => {
      class CreateMutationContainer extends React.Component<any> {
        private commit = (input: I) => {
          return commit(this.props.relayEnvironment, input);
        };

        public render() {
          const { relayEnvironment: _, ...rest } = this.props;
          const inject = {
            [propName]: this.commit
          };
          return <WrappedComponent {...rest} {...inject} />;
        }
      }
      return CreateMutationContainer as React.ComponentType<any>;
    })
  );
}

/**
 * createMutationContainer
 */
export default createMutationContainer;
