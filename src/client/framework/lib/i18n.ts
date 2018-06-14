import "fluent-intl-polyfill/compat";
import { negotiateLanguages as negotiate } from "fluent-langneg/compat";
import { MessageContext } from "fluent/compat";

export interface BundledLocales {
  [locale: string]: string;
}

export interface LoadableLocales {
  [locale: string]: (() => Promise<string>);
}

/**
 * This type describes the shape of the generated code from our `locales-loader`.
 * Please check `./src/loaders` and the webpack config for more information.
 */
export interface LocalesData {
  readonly defaultLocale: string;
  readonly fallbackLocale: string;
  readonly availableLocales: ReadonlyArray<string>;
  readonly bundled: BundledLocales;
  readonly loadables: LoadableLocales;
}

export function negotiateLanguages(
  userLocales: ReadonlyArray<string>,
  data: LocalesData
) {
  // Choose locale that is best for the user.
  const languages = negotiate(userLocales, data.availableLocales, {
    defaultLocale: data.defaultLocale,
    strategy: "lookup"
  });

  if (data.fallbackLocale && languages[0] !== data.fallbackLocale) {
    // Use default locale as fallback in case we have
    // missing keys.
    languages.push(data.fallbackLocale);
  }

  return languages;
}

// TODO: should only be used in development.
const decorateWarnMissing = (() => {
  const warnings: string[] = [];
  return cx => {
    const original = cx.hasMessage;
    cx.hasMessage = id => {
      const result = original.apply(cx, [id]);
      if (!result) {
        const warn = `${cx.locales} translation for key "${id}" not found`;
        if (!warnings.includes(warn)) {
          console.warn(warn);
          warnings.push(warn);
        }
      }
      return result;
    };
    return cx;
  };
})();

export async function generateMessages(
  locales: ReadonlyArray<string>,
  data: LocalesData
) {
  const promises = [];

  for (const locale of locales) {
    const cx = new MessageContext(locale);
    if (locale in data.bundled) {
      cx.addMessages(data.bundled[locale]);
      promises.push(decorateWarnMissing(cx));
    } else if (locale in data.loadables) {
      const content = await data.loadables[locale]();
      cx.addMessages(content);
      promises.push(decorateWarnMissing(cx));
    } else {
      throw Error(`Locale ${locale} not available`);
    }
  }

  return await Promise.all(promises);
}
