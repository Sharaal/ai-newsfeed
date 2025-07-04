---
layout: "post"
title: "TypeScript and Performance: Monomorphic vs Polymorphic Code"
---

In one of my latest tech talks I said "TypeScript can increase the performance of the application". There comes the question "How can this works, TypeScript gets transpiled into normal JavaScript". Thats true, but using TypeScript helps to write better performing JavaScript.

<!--more-->

## Hidden classes and inline cache

Modern JavaScript interpreters use JIT compilers with different techniques to increase the performance. Two of them are hidden classes and inline cache. I will not go to deep how this works in theory, just few examples whats the results of this techniques.

```javascript
function add(a, b) {
    return a + b;
}

// Monomorphic: Using a function always with the same datatypes
add(1, 2);
add(3, 4);

// Polymorphic: Use a function with different variation of datatypes
add(1, 2);
add('a', 'b');
```

Monomorphic functions becomes highly optimized if they are used a lot during the execution and will be very fast. But using this function sometimes polymorphic by parameters another datatypes means the function will through out of the cache and slows down.

Thats the difference TypeScript can help a lot with the datatype check.

## Summary

So using TypeScript doesn't really increase the performance, but it helps to write monomorphic code which is well prepared to becomes better optimized by the JIT compilers.
