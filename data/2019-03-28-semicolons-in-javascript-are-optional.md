---
layout: "post"
title: "Semicolons in JavaScript are optional?"
---

I won't make a suggestion for this nearly religion discussion using or omitting semicolons in JavaScript. But I experienced they are not always optional and omitting them can result in errors. So I will describe these scenarios and the workarounds.

<!--more-->

## Error scenarios

### Immediately executing anonymous function

First the example:
```javascript
console.log('example')
(async () => {})()
```

This results in the error `TypeError: console.log(...) is not a function`.

This happens because no semicolon will be automatically inserted and the interpreter try to run the code as it would be written like:
```javascript
console.log('example')(async () => {})();
```

And the return value of `console.log` isn't a function.

### Destructioning

First the example:
```javascript
let a, b
const c = [1, 2]
[a, b] = c
```

This results in the error `ReferenceError: c is not defined`.

This happens because no semicolon will be automatically inserted and the interpreter try to run the code as it would be written like:
```javascript
let a, b;
const c = [1, 2][a, b] = c
```

And `c` is not defined at this point.

## Workarounds

In both error scenarios the [automatically insertion of the semicolons](http://inimino.org/~inimino/blog/javascript_semicolons) doesn't work, because the line isn't a completed sequence. So we need to add the semicolons manually between the two lines, at the end of the first line (which collide with the rule to omit semicolons in the linters) or at the start of the second line.

So let's have a look at the two error scenarios which works with a manually added semicolon.

Immediately executing anonymous function:
```javascript
console.log('example')
;(async () => {})()
```

Destructioning:
```javascript
let a, b
const c = [1, 2]
;[a, b] = c
```

## Summary

Semicolons are not always optional, but with the rule of thumb `start lines with ; when they start with [ or (` it's easy to avoid the error scenarios and be able to add the rule to omitting semicolons at the end of the lines.
