---
layout: post
title: Context in JavaScript closures
categories:
  - name: programming
    relevance: 8
    reasoning: >-
      Der Text behandelt direkt ein wichtiges Programmierkonzept in JavaScript
      mit praktischen Codebeispielen und ist für alle JavaScript-Entwickler sehr
      relevant, da Closures ein fundamentales Konzept sind.
  - name: ai
    relevance: 1
    reasoning: >-
      Nur sehr indirekt relevant, da JavaScript-Kenntnisse auch in der
      KI-Entwicklung verwendet werden können, aber der Text behandelt kein
      KI-spezifisches Thema.
---

Closures are functions which use variables from the surrounded context. Using them without think about can result in unpredictable side effects:
<!--more-->

```javascript
var context = 'a';
var closure = function () {
    console.log(context);
};
closure(); // console.log: a
context = 'b';
closure(); // console.log: b
```

The closure use and depends on the current values of the context variables. The same function call with the same arguments results in different behaviors.

A possible way to save the state of the context is to wrap the closure with a self calling function:

```javascript
var context = 'a';
var closure = function (context) {
  return function () { console.log(context) };
}(context);
closure(); // console.log: a
context = 'b';
closure(); // console.log: a
```

The value of the argument get copied into the parameter which no longer changes and every function call results in the same behavior.

## Summary

Closures are useful and flexible. But care about using them with mutable context variables.
