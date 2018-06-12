import * as React from "react";
import { StatelessComponent } from "react";
import * as ReactDOM from "react-dom";

import {
  createContext,
  TalkContextProvider
} from "talk-framework/lib/bootstrap";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import AppQuery from "./queries/AppQuery";

const context = createContext();

const Entry: StatelessComponent = () => (
  <TalkContextProvider value={context}>
    <AppQuery />
  </TalkContextProvider>
);

ReactDOM.render(<Entry />, document.getElementById("app"));
