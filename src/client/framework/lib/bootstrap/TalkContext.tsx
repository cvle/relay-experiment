import { LocalizationProvider } from "fluent-react/compat";
import { MessageContext } from "fluent/compat";
import React, { StatelessComponent } from "react";
import { Environment } from "relay-runtime";

export interface TalkContext {
  relayEnvironment: Environment;
  localeMessages: MessageContext[];
}

const { Provider, Consumer } = React.createContext<TalkContext>({} as any);

export const TalkContextConsumer = Consumer;

export const TalkContextProvider: StatelessComponent<{
  value: TalkContext;
}> = ({ value, children }) => (
  <Provider value={value}>
    <LocalizationProvider messages={value.localeMessages}>
      {children}
    </LocalizationProvider>
  </Provider>
);
