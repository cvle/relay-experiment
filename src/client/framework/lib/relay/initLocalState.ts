import { commitLocalUpdate, Environment } from "relay-runtime";

import createAndRetain from "./createAndRetain";

export const LOCAL_ID = "client:root.local";
export const LOCAL_TYPE = "Local";

export function initLocalState(environment: Environment) {
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    root.setLinkedRecord(localRecord, "local");
  });
}
