import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { generateMessages, LocalesData, negotiateLanguages } from "../i18n";
import { TalkContext } from "./TalkContext";

function fetchQuery(operation, variables) {
  return fetch(
    `${window.location.protocol}//${window.location.hostname}:3000/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: operation.text,
        variables
      })
    }
  ).then(response => {
    return response.json();
  });
}

interface CreateContextArguments {
  userLocales: ReadonlyArray<string>;
  localesData: LocalesData;
}

export default async function createContext(
  args: CreateContextArguments
): Promise<TalkContext> {
  const relayEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
  });

  const locales = negotiateLanguages(args.userLocales, args.localesData);

  console.log(`Negotiated locales ${JSON.stringify(locales)}`);

  const localeMessages = await generateMessages(locales, args.localesData);

  return {
    relayEnvironment,
    localeMessages
  };
}
