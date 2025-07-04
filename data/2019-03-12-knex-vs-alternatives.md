---
layout: "post"
title: "Knex vs alternatives"
---

Working in code with a relational database can be done in different abstraction forms from writing SQL queries over using a query builder to completely abstract the type of the database by using an ORM.
But it's not only querying a database, also migration scripts needs to be defined and managed.

So let's have a critical look at [knex](https://knexjs.org/), where is it worth to use, where not and what are the alternatives.

<!--more-->

## Migrations

Here `knex` really shines. The setup with the `knexfile.js` and the commands are easy and the migrations with the definition of the schema table and their changes are readable and works smoothly. So there is no reason not to use it.

An example `knexfile.js`:
```javascript
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL
}
```

The commands used via `npx`:
* Create a new migration file: `npx knex migrate:make migration_name`
  Example migration (for more schema documentation see [https://knexjs.org/#Schema](https://knexjs.org/#Schema)):
  ```javascript
  module.exports.up = knex => knex.schema.createTable('users', table => {
    table.increments()

    table.string('email').notNullable()
    table.unique('email')

    table.string('passwordhash').notNullable()
  })

  module.exports.down = knex => knex.schema.dropTable('users')
  ```
* Migrate to the latest schema: `npx knex migrate:latest`

For more commands and their descriptions see: [https://knexjs.org/#Migrations-CLI](https://knexjs.org/#Migrations-CLI)

## Query builder

That’s the part where the discussions and the cons of `knex` start. As base for discussions it’s good to have a look at this article [https://medium.com/@gajus/stop-using-knex-js-and-earn-30-bf410349856c](https://medium.com/@gajus/stop-using-knex-js-and-earn-30-bf410349856c) (thx for [gajus](https://github.com/gajus) for the article and his library [slonik](https://www.npmjs.com/package/slonik) which inspired me to spend time into this topic).

The cons which are well described:
* SQL is a well known language, the syntax of `knex` needs to be learned on top of that. That makes it hard to think / prototype in plain SQL and then switch to the `knex` query building syntax. Also it makes it hard to read later on
* `knex` is NOT an abstraction layer. It’s not easily possible to move from e.g. `sqlite` to `pg` because the API of `knex` is different, e.g.:
  * Insert statement returning the incremental via `.returning('id')` in `pg`
  * The result object structure is different because it's the native structure of the database driver

On top of that the heavy use of the fluent interface makes it really hard to write mocks for automatic tests.

An example use case inserting a row and give the insert ID back:
```javascript
const url = 'url'
const id = (await knex('urls').insert({ url }).returning('id'))[0].id
```

And the unit test for it with the mocked knex object:
```javascript
const knex = sinon.fake.returns({
  insert: sinon.fake.returns({
    returning: sinon.fake.returns(Promise.resolve([{ id: '5' }]))
  }),
  select: sinon.fake()
})
const url = 'mocked url'

const id = (await knex('urls').insert({ url }).returning('id'))[0].id

assert(knex.calledOnce)
assert(knex.calledWith('urls'))

assert(knex().insert.calledOnce)
assert(knex().insert.calledWith({ url }))

assert(knex().insert().returning.calledOnce)
assert(knex().insert().returning.calledWith('id'))

assert(knex().select.notCalled)

assert(id === 5)
```

## Alternative: SQL queries with `pg`

In the code SQL is directly written:
```javascript
const url = 'url'
const id = (await client.query(
  `INSERT INTO urls (url) VALUES ($1) RETURNING ('id')`,
  [url]
)).rows[0].id
```

And the test for it:
```javascript
const client = {
  query: sinon.fake.returns(Promise.resolve([{ id: '5' }]))
}   

const url = 'url'
const id = (await client.query(
  `INSERT INTO urls (url) VALUES ($1) RETURNING ('id')`,
  [url]
)).rows[0].id

assert(client.query.calledOnce)
assert(client.query.calledWith([
  `INSERT INTO urls (url) VALUES ($1) RETURNING ('id')`,
  [url]
]))
assert.equal(id, '5')
```

## Alternative: SQL tagged template literal

Coming with ES6 the tagged template literals are a powerful new feature to define strings with values needs to be processed which perfectly fits into the requirements of a query builder.

The example by using SQL tag:
```javascript
const url = 'url'
const id = (await client.query(
  sql`INSERT INTO urls (url) VALUES (${url}) RETURNING ('id')`
)).rows[0].id
```

The pros of this approach:
* The automatic tests are as simple as using directly SQL queries
* It's not needed to care about the positioning of the values in the statements
* Syntax highlighting for SQL inside the string is possible
* With additional tags it's really powerful also for complex value types and nested queries

But wait, is it not highly vulnerable for SQL injection if forgetting the tag?
Yes. That's the reason a SQL tag should provide an own `.query()` function to check these before give `pg`'s native `client.query` the query:
```javascript
const url = 'url'
const id = (await sql.query(
  sql`INSERT INTO urls (url) VALUES (${url}) RETURNING ('id')`
)).rows[0].id
```

By using the combination of SQL tag and own `.query()` function it's basically not possible to have SQL injections.

It's also very easy to build smart helpers on top of the SQL tag:

```javascript
const url = 'url'
const id = await client.insert('urls', { url })
```

So this really helps if a service use complex or often SQL queries without loosing the full control over the database driver (it's still `pg`'s native `client.query`) and without an oversized library.

## Recommendation

* `knex` for migration scripts
* `pg` for writing SQL and testing the `client.query` calls
* If there are complex / often use of SQL queries in a service, have a look at SQL tagged template literals, e.g. [sql-pg](https://www.npmjs.com/package/sql-pg) or [slonik](https://www.npmjs.com/package/slonik)
