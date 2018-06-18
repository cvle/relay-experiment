import { commitLocalUpdate, Environment } from "relay-runtime";

import { createAndRetain } from "talk-framework/lib/relay";

export default function initLocalState(environment: Environment) {
  commitLocalUpdate(environment, s => {
    const root = s.getRoot();
    const localRecord = createAndRetain(
      environment,
      s,
      "client:root.local",
      "Client"
    );
    const networkRecord = createAndRetain(
      environment,
      s,
      "client:root.local.network",
      "Network"
    );
    networkRecord.setValue(false, "isOffline");
    localRecord.setLinkedRecord(networkRecord, "network");
    root.setLinkedRecord(localRecord, "local");
  });
}
