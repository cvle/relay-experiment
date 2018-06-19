import { mapValues, once } from "lodash";
import { ReactNode } from "react";
import { VALIDATION_REQUIRED, VALIDATION_TOO_SHORT } from "../messages";

type ValidationError = "TOO_SHORT";

interface BadUserInput {
  code: "BAD_USER_INPUT";
  exception: {
    invalidArgs: {
      [key: string]: ValidationError;
    };
  };
}

const validationMap = {
  TOO_SHORT: VALIDATION_TOO_SHORT,
  REQUIRED: VALIDATION_REQUIRED
};

export default class BadUserInputError extends Error {
  public readonly origin: BadUserInput;

  constructor(error: BadUserInput) {
    super("Form Arguments invalid");

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadUserInputError);
    }

    this.origin = error;
  }

  get invalidArgs() {
    return this.origin.exception.invalidArgs;
  }

  get invalidArgsLocalized(): { [key: string]: ReactNode } {
    return this.computeInvalidArgsLocalized();
  }

  private computeInvalidArgsLocalized = once(() => {
    return mapValues(this.invalidArgs, v => {
      if (v in validationMap) {
        return validationMap[v]();
      }
      return v;
    });
  });
}
