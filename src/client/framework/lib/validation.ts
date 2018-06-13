/**
 * createNotificationService returns a notification services based on pym.
 * @param  {func}    condition   callback that checks that the given argument is valid.
 * @param  {error}   string      error that is displayed when validation fails.
 * @return {func}    validator function
 */
export function createValidator(condition, error) {
  return (v, values) => (condition(v, values) ? undefined : error);
}

/**
 * composeValidators chains validators and runs them in sequence until
 * one validator fails and returns an error message.
 * @param  {func[]}  validators         array of validator functions.
 * @return {func}    validator fuction
 */
export function composeValidators(...validators) {
  return value =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
}

/**
 * required checks that the value is truthy.
 * @return {func}    validator fuction
 */
export const required = createValidator(v => !!v, "Field is required");
