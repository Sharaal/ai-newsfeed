---
layout: "post"
title: "One logo to rule them all"
---

Logos are needed in different formats and sizes: Apple touch icons, favicon and much more. And maybe they are needed in several projects.

<!--more-->

Wouldn't it be nice only store the logo one time at one place, all the projects use them and resize it to the needed formats and sizes?

## The idea

What would we need:

* A central place to store the logo in the original size
* In the projects a configuration which formats and sizes are needed and destination paths to store the resized logos
* ... A magical thing using both to provide the resized logos ...

## The solution

### The central place: GitHub + NPM

A GitHub repository is very nice. It costs nothing, we can track the changes and we can easily get the logo into all projects with NPM.

### The configuration: JSON

A JSON file is perfect to store the configuration which formats and sizes we need in the project and with which paths the resized logos should be stored:

```json
[
  {
    "source": "node_modules/dragonprojects-logo/logo.png",
    "path": "www/",
    "destinations": [
      { "path": "img/apple-touch-icon/ipad.png", "width": 76 },
      { "path": "img/apple-touch-icon/ipad-retina.png", "width": 152 },
      { "path": "img/apple-touch-icon/iphone.png", "width": 60 },
      { "path": "img/apple-touch-icon/iphone-retina.png", "width": 120 },
      { "path": "favicon.ico", "width": 32 }
    ]
  }
]
```

### The magical thing: [dlogos](http://github.com/dnode/dlogos)

A small NPM package which use the logo and the configuration and resize with imagemagick the logo into all formats and sizes to store them in the defined paths.

```json
{
  "scripts": {
    "postinstall": "dlogos"
  },
  "dependencies": {
    "dlogos": "^1.1.0",
    "dragonprojects-logo": "^1.0.0"
  }
}
```

## Extra: QR Codes

With [dqrcodes](http://github.com/dnode/dqrcodes)" the same concept works also for automatically generating QR Code Images. For example the QR Codes of [http://dscores.de](http://dscores.de).

```json
[
  {
    "path": "www/img/dqwixx/apps-qrcode.png",
    "url": "http://build.phonegap.com/apps/1944299/install"
  },
  {
    "path": "www/img/dqwixx/www-qrcode.png",
    "url": "http://dqwixx.dscores.de"
  }
]
```

## Summary

So with the logo stored in a GitHub repository, the `dlogos.json` configure the needed formats and sizes and the [dlogos](http://github.com/dnode/dlogos) package we realized our wish.
