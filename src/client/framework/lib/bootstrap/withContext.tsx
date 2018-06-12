import * as React from "react";
import { hoistStatics, InferableComponentEnhancer } from "recompose";
import { TalkContext, TalkContextConsumer } from "./TalkContext";

function withContext<T>(
  callback: (context: TalkContext) => T
): InferableComponentEnhancer<T> {
  return hoistStatics<T>(
    <U extends T>(WrappedComponent: React.ComponentType<U>) => (props: any) => (
      <TalkContextConsumer>
        {context => <WrappedComponent {...props} {...callback(context)} />}
      </TalkContextConsumer>
    )
  );
}

export default withContext;
