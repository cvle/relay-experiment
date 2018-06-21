interface UnknownErrorExtension {
  code: string;
}

export default class UnknownServerError extends Error {
  public origin: UnknownErrorExtension;

  constructor(msg: string, error: UnknownErrorExtension) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownServerError);
    }

    this.origin = error;
  }
}
