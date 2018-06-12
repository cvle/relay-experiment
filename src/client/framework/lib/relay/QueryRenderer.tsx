import * as React from "react";
import { QueryRenderer } from "react-relay";

import { TalkContextConsumer } from "../bootstrap/TalkContext";

export default props => (
  <TalkContextConsumer>
    {({ relayEnvironment }) => (
      <QueryRenderer environment={relayEnvironment} {...props} />
    )}
  </TalkContextConsumer>
);
