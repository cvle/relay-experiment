import React from "react";

// TODO: Extract useful common types into its own package.

export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

export type Omit<U, K extends keyof U> = Pick<U, Diff<keyof U, K>>;

export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type ReturnPropTypes<T> = T extends React.ComponentType<infer R>
  ? R
  : any;
