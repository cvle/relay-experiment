import { Environment, RecordProxy, RecordSourceProxy } from "relay-runtime";

export default function createAndRetain(
  environment: Environment,
  source: RecordSourceProxy,
  id: string,
  type: string
): RecordProxy {
  const result = source.create(id, type);
  environment.retain({
    dataID: id,
    node: { selections: [] },
    variables: {}
  });
  return result;
}
