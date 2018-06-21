// Allowing loading fluent files.
declare module "*.ftl";
declare module "fluent-react/compat";
declare module "fluent-langneg/compat";

declare module "fluent/compat" {
  export interface MessageContextOptions {
    functions: { [key: string]: (...args: any[]) => string };
    useIsolating: boolean;
    transform: ((s: string) => string);
  }

  export class MessageContext {
    constructor(locales: string, options?: MessageContext);
    public locales: string[];
    public readonly messages: any;
    public hasMessage(id: string): boolean;
    public getMessage(id: string): any;
    public addMessages(source: string): string[];
    public format(
      message: object | string,
      args?: object,
      errors?: string[]
    ): string | null;
  }
}
