import { Environment, RecordSourceProxy as RecordSourceProxyOriginal} from "relay-runtime";

declare module "relay-runtime" {
  export function commitLocalUpdate(
    environment: Environment,
    updater: StoreUpdater
  ): void;

  export interface RecordSourceProxy extends RecordSourceProxyOriginal {
    get(id: string): RecordProxy;
  }
}
