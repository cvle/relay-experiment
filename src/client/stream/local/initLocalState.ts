import { commitLocalUpdate, Environment } from "relay-runtime";

import { createAndRetain } from "talk-framework/lib/relay";

import { LOCAL_ID, LOCAL_TYPE, NETWORK_ID, NETWORK_TYPE } from "./constants";

export default function initLocalState(environment: Environment) {
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();
    const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
    const networkRecord = createAndRetain(
      environment,
      s,
      NETWORK_ID,
      NETWORK_TYPE
    );
    networkRecord.setValue(false, "isOffline");
    localRecord.setLinkedRecord(networkRecord, "network");
    root.setLinkedRecord(localRecord, "local");
  });
}
