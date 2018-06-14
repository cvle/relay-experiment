import * as React from "react";
import { StatelessComponent } from "react";
import * as ReactDOM from "react-dom";

import {
  createContext,
  TalkContextProvider
} from "talk-framework/lib/bootstrap";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import localesData from "./locales";
import AppQuery from "./queries/AppQuery";

async function main() {
  const context = await createContext({
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
