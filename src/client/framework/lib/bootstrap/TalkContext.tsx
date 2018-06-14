import { LocalizationProvider } from "fluent-react/compat";
import * as React from "react";
import { Environment } from "relay-runtime";

export interface TalkContext {
  relayEnvironment: Environment;
  // TODO: need fluent types.
  localeMessages: any;
}

const { Provider, Consumer } = React.createContext<TalkContext>({} as any);

export const TalkContextConsumer = Consumer;

export const TalkContextProvider = ({ value, children }) => (
  <Provider value={value}>
    <LocalizationProvider messages={value.localeMessages}>
      {children}
    </LocalizationProvider>
  </Provider>
);
