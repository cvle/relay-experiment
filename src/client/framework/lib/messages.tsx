import { Localized } from "fluent-react/compat";
import React from "react";

export const VALIDATION_REQUIRED = () => (
  <Localized id="framework-validation-required">
    <span>This field is required.</span>
  </Localized>
);

export const VALIDATION_TOO_SHORT = () => (
  <Localized id="framework-validation-too-short">
    <span>This field is too short.</span>
  </Localized>
);
