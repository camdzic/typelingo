import {
    ExtractKeys, Locale, LocaleMessages, MergeLocaleMessages, TypeLingoOptions,
} from "./types";

export class TypeLingo<T extends Locale> {
  private locales: ReadonlyArray<T>;
  private currentLocale: T;

  constructor(options: TypeLingoOptions<T>) {
    this.locales = options.locales;
    this.currentLocale = options.currentLocale;
  }

  changeLocale(locale: T) {
    if (this.locales.includes(locale)) {
      this.currentLocale = locale;
    } else {
      throw new Error(`Locale '${locale}' is not available`);
    }
  }

  create<Messages extends LocaleMessages<T>>(messages: Messages) {
    return new LocalizedMessage(messages, () => this.getCurrentLocale());
  }

  getCurrentLocale() {
    return this.currentLocale;
  }
}

class LocalizedMessage<T extends Locale, Messages extends LocaleMessages<T>> {
  private messages: Messages;
  private getCurrentLocale: () => T;

  private variations: Array<{
    condition: (
      params: Record<ExtractKeys<Messages[keyof Messages]>, any>,
    ) => boolean;
    messages: LocaleMessages<T>;
  }>;

  constructor(messages: Messages, getCurrentLocale: () => T) {
    this.messages = messages;
    this.getCurrentLocale = getCurrentLocale;

    this.variations = [];
  }

  variation<M extends LocaleMessages<T>>(
    condition: (
      params: Record<ExtractKeys<Messages[keyof Messages]>, any>,
    ) => boolean,
    messages: M,
  ): LocalizedMessage<T, MergeLocaleMessages<T, Messages, M>> {
    this.variations.push({ condition, messages });
    return this as any;
  }

  get(
    params: Record<ExtractKeys<Messages[keyof Messages]>, any>,
    locale: T = this.getCurrentLocale(),
  ) {
    const message = this.messages[locale];

    if (message) {
      let result = message;

      for (const variation of this.variations) {
        if (variation.condition(params)) {
          const variationMessage = variation.messages[locale];

          if (variationMessage) {
            result = variationMessage as Messages[T];
            break;
          }
        }
      }

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          result = result.replace(
            `{${key}}`,
            params[key as keyof typeof params],
          ) as Messages[T];
        }
      }

      return result;
    } else {
      throw new Error(`No message found for locale '${locale}'`);
    }
  }
}
