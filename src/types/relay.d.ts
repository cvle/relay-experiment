import {
  Environment,
  RecordSourceProxy as RecordSourceProxyOriginal
} from "relay-runtime";

declare module "relay-runtime" {
  // Fix wrong types.
  export function commitLocalUpdate(
    environment: Environment,
    updater: StoreUpdater
  ): void;

  // Fix wrong types.
  export interface RecordSourceProxy extends RecordSourceProxyOriginal {
    get(id: string): RecordProxy;
  }
}
