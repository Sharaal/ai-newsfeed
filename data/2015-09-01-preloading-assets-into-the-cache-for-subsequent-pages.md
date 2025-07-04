---
layout: post
title: Preloading assets into the cache for subsequent pages
categories:
  - name: programming
    relevance: 8
    reasoning: >-
      Der Artikel behandelt konkrete Programmiertechniken mit JavaScript und
      HTML-Code-Beispielen für Asset-Preloading, was für Webentwickler sehr
      relevant ist.
  - name: ai
    relevance: 2
    reasoning: >-
      Nur minimale Relevanz, da der Artikel zwar technisch ist, aber keine
      direkten KI-Bezüge aufweist - es geht um klassische Weboptimierung.
  - name: security
    relevance: 3
    reasoning: >-
      Geringe Relevanz durch die Erwähnung des X-Frame-Option Headers, der ein
      Sicherheitsfeature ist, aber nicht im Fokus des Artikels steht.
  - name: work
    relevance: 4
    reasoning: >-
      Moderate Relevanz für Webentwickler und Frontend-Teams, die
      Performance-Optimierung implementieren müssen, aber nicht
      branchenübergreifend relevant.
---

In some scenarios (e.g. having a landing page with the login to the client) the assets needed for subsequent pages are known, can preloaded into the cache and speeds up their first page view.

<!--more-->

## Load assets without executing

The requirement for preloading is to load the assets, but not execute them and affects the page. So the `<script>` for JavaScript and the `<link>` for CSS won't work here.

But there are another tags which loads assets. The `<object>` works for all browsers except Internet Explorer, which use another cache for `<object>` loaded assets. The Internet Explorer have with `new Image()` an alternative solution. So we combine this two approaches with a small browser detection:

```html
<script>
$(function () {
  var caches = [
    '/path/to/the/asset.css',
    '/path/to/the/asset.js',
  ];
  var isIE = navigator.appName.indexOf('Microsoft') === 0;
  $.each(caches, function (k, cache) {
    if (isIE) {
      new Image().src = cache;
    } else {
      var object = $('<object>').attr({ data: cache, width: 0, height: 0});
      $('body').append(object);
    }
  });
});
</script>
```

Interesting information in this scenario: `<object>` requests will be blocked by the `X-Frame-Option` header set to `DENY`. The server delivers the assets must not set this header.

## Summary

Preloading assets isn't a build in feature of the browsers, but works with workarounds. The solution will speed up the first page view of the subsequent page without affecting the page we use to preload.
