---
layout: "post"
title: "Node.js clustering in multi CPU environments"
---

Node.js is single threaded. To use the capacity of multi CPU environments clustering is needed. There are solutions already available, so just have a quick look at one of them.

<!--more-->

`throng` is the name of the package, accepts a function to initialize an instance and options, in the following example it requires the `app.js`. The first important option is the amount of instances. For Heroku use the environment variable `WEB_CONCURRENCY` contains of amount of CPUs or total ram / ram per instance. For other environments the fallback is the amount of CPUs. The second important option is the lifetime of each instance.

```javascript
require('throng')(
    () => require('./app'),
    {
        workers: process.env.WEB_CONCURRENCY,
        lifetime: Infinity
    }
);
```

Now we use this `cluster.js` in the `npm start` definition. For local development, we define a user script which starts only one instance of the application (e.g. with `nodemon` watching and restarting on changes).

```json
{
  "main": "app.js",
  "scripts": {
    "start": "node cluster.js",
    "start-watch": "nodemon --watch app.js"
  },
  "dependencies": {
    "throng": "^1.0.0"
  },
  "devDependencies": {
    "nodemon": "^1.3.7"
  }
}
```

## Summary

Clustering in multi CPU environments must be handled by the application itself, but can easily supported with already available solutions and less effort.
