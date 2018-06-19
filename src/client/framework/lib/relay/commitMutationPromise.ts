import { commitMutation } from "react-relay";
import { Environment, MutationConfig } from "relay-runtime";

import { Omit } from "talk-framework/types";

import { BadUserInputError } from "../errors";

export type MutationConfigPromise<T> = Omit<
  MutationConfig<T>,
  "onCompleted" | "onError"
>;

// Extract the payload from the response,
// hide the clientMutationId detail.
function getPayload(response) {
  const keys = Object.keys(response);
  if (keys.length !== 1) {
    return response;
  }
  const { clientMutationId, ...rest } = response[keys[0]];

  if (clientMutationId === undefined) {
    return response;
  }

  return rest;
}

function getError(error) {
  let e = error;
  if (Array.isArray(error)) {
    if (e.length > 1) {
      // tslint:disable-next-line: no-console
      console.error(`Unexpected Error array length, should be 1`, error);
    }
    e = error[0];
  }
  if (e.extensions) {
    e = e.extensions;
  }
  if (e.code === "BAD_USER_INPUT") {
    e = new BadUserInputError(e);
  }
  return e;
}

export async function commitMutationPromiseNormalized<T = any>(
  environment: Environment,
  config: MutationConfigPromise<T>
) {
  try {
    const response = await commitMutationPromise(environment, config);
    return getPayload(response);
  } catch (e) {
    throw getError(e);
  }
}

export function commitMutationPromise<T = any>(
  environment: Environment,
  config: MutationConfigPromise<T>
) {
  return new Promise<any>((resolve, reject) => {
    commitMutation(environment, {
      ...config,
      onCompleted: (response, errors) => {
        if (errors) {
          reject(errors);
          return;
        }
        resolve(getPayload(response));
      },
      onError: error => {
        reject(error);
      }
    });
  });
}
