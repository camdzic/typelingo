# TypeLingo

Build and use fully type-safe translations in your app.

## Introduction to TypeLingo

TypeLingo is a library that allows you to build and use fully type-safe translations in your app. It is built on top of the TypeScript type system and is designed to be used with the [TypeScript](https://www.typescriptlang.org/) programming language.

## Features

- [x] Fully type-safe translations
- [x] No dependencies
- [x] Well-tested and production-ready

```bash
npm install typelingo
```

# Usage

## First create an instance of TypeLingo

```typescript
import { TypeLingo } from "typelingo";

const locales = ["en", "ba", "de"] as const;
const currentLocale = "en";

const typelingo = new TypeLingo({
  locales,
  currentLocale,
});
```

## Then define your translations

```typescript
const greet = typelingo.create({
  en: "Hello",
  ba: "Zdravo",
  de: "Hallo",
});

console.log(greet.get({})); // Hello
```

## Variables in translations

```typescript
const greet = typelingo.create({
  en: "Hello, {name}",
  ba: "Zdravo, {name}",
  de: "Hallo, {name}",
});

console.log(greet.get({ name: "Aldin" })); // Hello, Aldin
```

## Variations in translations

```typescript
const greet = typelingo
  .create({
    en: "Hello, {name}! You are {age} years old",
    ba: "Zdravo, {name}! Imaš {age} godina",
    de: "Hallo, {name}! Du bist {age} Jahre alt",
  })
  .variation({ age }) => parseInt(age) > 18, {
    en: "Hello, {name}! You are an adult",
    ba: "Zdravo, {name}! Ti si odrastao",
    de: "Hallo, {name}! Du bist erwachsen",
  });

console.log(greet.get({ name: "Aldin", age: "15" })); // Hello, Aldin! You are 15 years old
console.log(greet.get({ name: "Aldin", age: "20" })); // Hello, Aldin! You are an adult
```

## Dynamic locale change

```typescript
import { TypeLingo } from "typelingo";

const locales = ["en", "ba", "de"] as const;
const currentLocale = "en";

const typelingo = new TypeLingo({
  locales,
  currentLocale,
});

const greet = typelingo.create({
  en: "Hello, {name}",
  ba: "Zdravo, {name}",
  de: "Hallo, {name}",
});

console.log(greet.get({ name: "Aldin" })); // Hello, Aldin

typelingo.changeLocale("ba");

console.log(greet.get({ name: "Aldin" })); // Zdravo, Aldin
```

Locales can also be passed as an parameter to the `get` method.

```typescript
console.log(greet.get({ name: "Aldin" }, "de")); // Hallo, Aldin
```
