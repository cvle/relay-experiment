import { commitLocalUpdate, Environment, RecordProxy } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";

import { NETWORK_ID } from "../local";

export interface SetNetworkStatusInput {
  isOffline: boolean;
}

export type SetNetworkStatusMutation = (input: SetNetworkStatusInput) => void;

function commit(environment, input: SetNetworkStatusInput) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(NETWORK_ID);
    record.setValue(input.isOffline, "isOffline");
  });
}

export const withSetNetworkStatusMutation = createMutationContainer(
  "setNetworkStatus",
  commit
);
