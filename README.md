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
} as const);

console.log(greet.get({})); // Hello
```

## Variables in translations

```typescript
const greet = typelingo.create({
  en: "Hello, {name}",
  ba: "Zdravo, {name}",
  de: "Hallo, {name}",
} as const);

console.log(greet.get({ name: "Aldin" })); // Hello, Aldin
```

## Variations in translations

```typescript
const greet = typelingo
  .create({
    en: "Hello, {name}!",
    ba: "Zdravo, {name}!",
    de: "Hallo, {name}!",
  } as const)
  .variation(({ name }) => name === "Aldin", {
    en: "Hello, {name}! You are {age} years old",
    ba: "Zdravo, {name}! Ti imaš {age} godina",
    de: "Hallo, {name}! Du bist {age} Jahre alt",
  } as const);

console.log(greet.get({ name: "John", age: 18 })); // Hello, John!
console.log(greet.get({ name: "Aldin", age: 18 })); // Hello, Aldin! You are 18 years old
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
  en: "Hello",
  ba: "Zdravo",
  de: "Hallo",
} as const);

console.log(greet.get({})); // Hello

typelingo.changeLocale("ba");

console.log(greet.get({})); // Zdravo
```

Locales can also be passed as an parameter to the `get` method.

```typescript
console.log(greet.get({}, "de")); // Hallo
```

## Example on Discord Bot

```typescript
import { TypeLingo } from "typelingo";
import { Client, Events, GatewayIntentBits } from "discord.js";

const locales = ["en", "ba", "de"] as const;
const currentLocale = "en";

const typelingo = new TypeLingo({
  locales,
  currentLocale,
});

const client = new Client({
  intents: [GatewayIntentBits.GuildMembers],
});

client.on(Events.GuildMemberAdd, (member) => {
  const greet = typelingo
    .create({
      en: "Hello, {displayName}! Welcome to the {guildName} server!",
      ba: "Zdravo, {displayName}! Dobrodošli na {guildName} server!",
      de: "Hallo, {displayName}! Willkommen auf dem {guildName} Server!",
    } as const)
    .variation(({ displayName }) => displayName === "Aldin", {
      en: "Hello, {displayName}! Welcome to the {guildName} server! You are special!",
      ba: "Zdravo, {displayName}! Dobrodošli na {guildName} server! Ti si poseban!",
      de: "Hallo, {displayName}! Willkommen auf dem {guildName} Server! Du bist speziell!",
    } as const);

  member.send({
    content: greet.get({
      displayName: member.user.displayName,
      guildName: member.guild.name,
    }),
  });
});

client.login();
```
