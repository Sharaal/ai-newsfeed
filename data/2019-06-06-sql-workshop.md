---
layout: "post"
title: "SQL Workshop"
---

Because of security issues I did a very small SQL workshop in my company focused on SQL Injections.

So I explain them what they are, what the issues are and how to ensure not having any issues with them. Also some more topics in a rough walkthrough like proper database design and some best practices.

<!--more-->

## SQL Injection

SQL Injection means to change the expected behaviour of a SQL query by sending parts of the SQL query instead of only values and can always be done if the values are not right escaped. It's the number one reason of all security problems out in the world.

e.g. Update email of an user:

```javascript
app.post('/users/email', async (req, res) => {
  const email = req.body.email
  const id = req.user.id
  await db.query(`UPDATE users SET email = '${email}' WHERE id = ${id}`)
  res.sendStatus(204)
})
```

The expected behaviour if there is a post which contains:

```json
{
  "email": "sharaal@example.com"
}
```

works fine.

But what happens if there is an attacker trying some injection by sending:

```json
{
  "email": "attacker@example.com' WHERE id = 1 --"
}
```

In this case the SQL which is executed looks like:

```sql
UPDATE users SET email = 'attacker@example.com' WHERE id = 1 --' WHERE id = 5
```

And if the user with the ID 1 is an admin, the attacker can to a password forget with his own email address and took successfully over these account.

### Parameters

To solve that kind of security issues all values which are not hardcoded in the SQL query needs to be escaped. DB drivers should provide own solution for that, so it's recommended to use that and never building an own solution.

For PostgreSQL parameters are the way to go: using placeholders in the SQL query, send the values separately and the database will handle them securely.

e.g. Update email of an user:

```javascript
app.post('/users/email', async (req, res) => {
  const email = req.body.email
  const id = req.user.id
  await db.query(
    `UPDATE users SET email = $1 WHERE id = $2`,
    [email, id]
  )
  res.sendStatus(204)
})
```

That's all. Follow these and never have security issues because of SQL Injections.

### Identifiers (table/column names)

Because of technical reasons (changed query paths), placeholders we use for values are not allowed for identifiers. Also here different databases has different solutions to solve these, some just don't have any.

PostgreSQL is one of the database don't have a solution, but a well documented format of identifiers, so we can easily write an own escape function:

```javascript
function escapeIdentifier (identifier) {
  return `"${identifier.replace(/"/g, '""')}"`
}
```

Every `"` will be replaced by `""` to be escaped an the identifier is surrounded by `"`.

So if the table name should be dynamically in the user email example, it will looks like:

```javascript
const tableName = 'users'

app.post('/users/email', async (req, res) => {
  const email = req.body.email
  const id = req.user.id
  await db.query(
    `UPDATE ${escapeIdentifier(tableName)} SET email = $1 WHERE id = $2`,
    [email, id]
  )
  res.sendStatus(204)
})
```

## Additional Solution: SQL Tagged Template Literal

With ES6 tagged template literals was introduced and can be used to build sql queries. The user email example using them would look like:

```javascript
const tableName = 'users'

app.post('/users/email', async (req, res) => {
  const email = req.body.email
  const id = req.user.id
  await sql.query(
    sql`UPDATE ${sql.key(tableName)} SET email = ${email} WHERE id = ${id}`
  )
  res.sendStatus(204)
})
```

The sql tag handles the splitting of the query and the values automatically and provide also a method to escape identifiers together with a lot more convenience methods. Using this kind of solution does it makes ensures SQL Injections are not possible to have.

## Database Design

### ID

- Always have a serial ID column named `id`

### Timestamps

- Always have a `created_at` column automatically filled with the current timestamp if inserting new rows and a `updated_at` column automatically filled with the current timestamp if inserting new rows or updating existing ones

`updated_at` needs a special solution for PostgreSQL:

Custom function:

```sql
CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql'
```

Trigger for every table, e.g. users:
```sql
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp()
```

### Indices

- All columns used in joins and where conditions should be indexed
- Combined indexes needs care about the order of the including columns

### Relations

- Always use INNER JOIN if OUTER JOIN is not explicit needed
- Always use the ON of the JOINs for the foreign keys instead of compare them in the WHERE

Different relations:
- 1:1: related table has an unique foreign key to the host table
- 1:n: related table has a foreign key to the host table
- m:n: relation table with both IDs of the related tables

## Best Practices

### Uppercased Keywords / Lowercased Identifier

Easier to read if used consequent independently if syntax highlighting is available (e.g. in logs). e.g.:

```sql
-- bad
select * from users

-- good
SELECT * FROM users
```

### Always use lowercased identifier

Even if it's possible, it's hard to work with identifiers having uppercased characters, e.g.:

```sql
-- bad
SELECT * FROM "Users"

-- good
SELECT * FROM users
```

### Never INSERT INTO without columns

```sql
-- bad
INSERT INTO users VALUES
  (null, 'sharaal@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

-- Not possible to omit columns with default values
-- It will break if there are changes in the table schema

-- good
INSERT INTO users (email) VALUES ('sharaal@example.com')
```

### Split Migrations and Service Technologies

- Evaluate and use solutions for migrations and querying in services separately
- e.g. `knex` for migrations, `pg` for querying in services
- Think about query builder if the queries become more complex with the native `pg` use
