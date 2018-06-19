import { noop } from "lodash";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { NetworkError } from "../errors";
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
  )
    .then(response => {
      return response.json();
    })
    .catch(err => {
      if (err instanceof TypeError) {
        // Network error, e.g. offline.
        throw new NetworkError("TypeError", err.message);
      }
      // Unknown error.
      throw new NetworkError("Unknown", err);
    });
}

interface CreateContextArguments {
  source?: RecordSource;
  userLocales: ReadonlyArray<string>;
  localesData: LocalesData;
  init?: ((context: TalkContext) => void);
}

export default async function createContext({
  source = new RecordSource(),
  init = noop,
  userLocales,
  localesData
}: CreateContextArguments): Promise<TalkContext> {
  const relayEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(source)
  });

  const locales = negotiateLanguages(userLocales, localesData);

  console.log(`Negotiated locales ${JSON.stringify(locales)}`);

  const localeMessages = await generateMessages(locales, localesData);

  const context = {
    relayEnvironment,
    localeMessages
  };

  await init(context);

  return context;
}
