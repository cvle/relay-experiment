import * as React from "react";
import { Environment } from "relay-runtime";

export interface TalkContext {
  relayEnvironment?: Environment;
}

export const {
  Provider: TalkContextProvider,
  Consumer: TalkContextConsumer
} = React.createContext<TalkContext>({});
