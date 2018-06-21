import { FormApi } from "final-form";
import { ReactNode } from "react";
import { FormProps } from "react-final-form";

type ErrorsObject<T> = { [K in keyof T]?: ReactNode };

export type OnSubmit<T> = (
  values: T,
  form: FormApi
) => ErrorsObject<T> | Promise<ErrorsObject<T>>;
