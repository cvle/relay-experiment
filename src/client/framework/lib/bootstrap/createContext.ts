import { Environment, Network, RecordSource, Store } from "relay-runtime";

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

export default function createContext(): TalkContext {
  const relayEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
  });

  return {
    relayEnvironment
  };
}
