import * as React from "react";
import { StatelessComponent } from "react";
import * as ReactDOM from "react-dom";

import {
  createContext,
  TalkContext,
  TalkContextProvider
} from "talk-framework/lib/bootstrap";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import { initLocalState } from "./local";
import localesData from "./locales";
import AppQuery from "./queries/AppQuery";

async function init({ relayEnvironment }) {
  await initLocalState(relayEnvironment);
}

async function main() {
  const context = await createContext({
    init,
    localesData,
    userLocales: navigator.languages
  });

  const Entry: StatelessComponent = () => (
    <TalkContextProvider value={context}>
      <AppQuery />
    </TalkContextProvider>
  );

  ReactDOM.render(<Entry />, document.getElementById("app"));
}

main();
