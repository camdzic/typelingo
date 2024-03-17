export type Locale = string;

export type LocaleMessages<T extends Locale> = {
  [key in T]: string;
};

export type MergeLocaleMessages<
  T extends Locale,
  A extends LocaleMessages<T>,
  B extends LocaleMessages<T>,
> = {
  [key in T]: A[key] | B[key];
};

export interface TypeLingoOptions<T extends Locale> {
  locales: ReadonlyArray<T>;
  currentLocale: T;
}

export type ExtractKeys<S extends string> =
  S extends `${infer Prefix}{${infer VariableName}}${infer Suffix}`
    ? VariableName | ExtractKeys<Suffix>
    : never;
