---
layout: post
title: async behavior in JavaScript
categories:
  - name: programming
    relevance: 9
    reasoning: >-
      Dieser Text ist hochrelevant für Programmierer, da er ein fundamentales
      Konzept der JavaScript-Programmierung erklärt - das asynchrone Verhalten,
      welches als einer der größten Meilensteine beim Erlernen von JavaScript
      beschrieben wird.
  - name: ai
    relevance: 2
    reasoning: >-
      Nur sehr geringe Relevanz, da der Text zwar Programmierkonzepte behandelt,
      die in der KI-Entwicklung verwendet werden können, aber keine spezifischen
      AI-Themen oder -Technologien anspricht.
  - name: work
    relevance: 6
    reasoning: >-
      Mittlere Relevanz für die Arbeitswelt, da asynchrone Programmierung ein
      wichtiges Skill für Webentwickler ist und das Verständnis dieser Konzepte
      die Arbeitsqualität und Effizienz in der Softwareentwicklung erheblich
      verbessert.
  - name: databases
    relevance: 4
    reasoning: >-
      Geringe bis mittlere Relevanz, da der Text ein Beispiel mit
      Datenbankabfragen (db.findUserById()) verwendet, um asynchrones Verhalten
      zu demonstrieren, aber Datenbanken nicht im Fokus stehen.
---

Understanding the async behavior is one of the largest milestone in learning JavaScript. I will give you a very first overview what it is.

<!--more-->

## Procedural code

JavaScript is a language which supports procedural code. What does this mean? It means just the code runs line by line:

```javascript
const variable;
variable = 'example';
console.log(variable);
```

The order what happens is easy to understand:

* The variable gets defined
* It gets assigned with `example`
* It gets logged out to the console

## Event loop and process.nextTick()

But procedural is not all, JavaScript have an event loop. It runs all the code line by line, have a look if there is something next in the event loop, runs this code line by line and so on:

```javascript
console.log('1');
process.nextTick(() => {
  console.log('3');
});
console.log('2');
```

The order the code runs now is not anymore the same order we wrote the lines:

* First `1` gets logged
* Then we add a function to the end of the event loop
* `2` gets logged
* The current loop is over, JavaScript look at the event loop, find and run our
  function we added, `3` gets logged

This is what single threaded and non blocking means. The code run in a single thread, only one part of the code can run at the same time. But its possible to add something to the end of the event loop without blocking the followed code.

## Async behavior

With this in mind we now better understand how async behaves:

```javascript
let user;
db.findUserById(1, record => {
  user = record;
});
console.log(user);
```

We get an `undefined`, because `db.findUserById()` add the callback at the end of the event loop. So the `console.log(user)` runs before the callback which assign user to the record.

### Event driven

In the last example we got in touch with another concept named event driven. The `db.findUserById()` will not run immediately at the end of the event loop, because the database need some time to find the user. It register an event which will be triggered after the user is found. But that doesn't change the async behavior, because also if the database is fast enough to find the user, the callback can't run before the current code in the event loop is finished.

## Summary

It's a very important step to understand async and start to think about which functions runs async and which code runs in which order.

Read more about how to [write async code in JavaScript](/2018/02/02/write-async-code-in-javascript.html).
