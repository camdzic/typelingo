import { Locale, LocaleMessages, TypeLingoOptions } from "./types";

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

  create(messages: LocaleMessages<T>) {
    return new LocalizedMessage(messages, () => this.getCurrentLocale());
  }

  getCurrentLocale() {
    return this.currentLocale;
  }
}

class LocalizedMessage<T extends Locale> {
  private messages: LocaleMessages<T>;
  private getCurrentLocale: () => T;

  private variations: Array<{
    condition: (params: Record<string, any>) => boolean;
    messages: LocaleMessages<T>;
  }>;

  constructor(messages: LocaleMessages<T>, getCurrentLocale: () => T) {
    this.messages = messages;
    this.getCurrentLocale = getCurrentLocale;

    this.variations = [];
  }

  variation(
    condition: (params: Record<string, any>) => boolean,
    messages: LocaleMessages<T>,
  ) {
    this.variations.push({ condition, messages });
    return this;
  }

  get(params: Record<string, any>, locale: T = this.getCurrentLocale()) {
    const message = this.messages[locale];

    if (message) {
      let result = message;

      for (const variation of this.variations) {
        if (variation.condition(params)) {
          const variationMessage = variation.messages[locale];

          if (variationMessage) {
            result = variationMessage;
            break;
          }
        }
      }

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          result = result.replace(`{${key}}`, params[key]);
        }
      }

      return result;
    } else {
      throw new Error(`No message found for locale '${locale}'`);
    }
  }
}
