export type Locale = string;

export type LocaleMessages<T extends Locale> = {
  [key in T]: string;
};

export interface TypeLingoOptions<T extends Locale> {
  locales: ReadonlyArray<T>;
  currentLocale: T;
}
