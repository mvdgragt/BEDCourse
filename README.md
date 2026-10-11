# SQL Injection Homework: Attacking (and then Defending) the Database

Last week we built a database app and _defended_ it with parameterized queries (`$1`) and Zod. This week we look at what happens when those defenses are missing, using **PortSwigger's Web Security Academy** labs.

## What to Hand In

A `homework.md` file where, for each lab, you note: **(1)** the payload (syntax) you used, **(2)** the query you think it produced, **(3)** one line on _why_ it worked. Plus the challenge-9 fix. Push to branch `week9/sql-injection`.

## Resources

- Video tutorial: https://www.youtube.com/watch?v=UtyG-cWpsiw

- Start here: https://portswigger.net/web-security/sql-injection (read to the end of "Retrieving data from other database tables")
- UNION attacks: https://portswigger.net/web-security/sql-injection/union-attacks
- Cheat sheet (payload syntax per database): https://portswigger.net/web-security/sql-injection/cheat-sheet
- Preventing it: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- Make a free account: https://portswigger.net/web-security/getting-started

### Key payloads

```sql
administrator'--              -- ' closes the string, -- comments out the rest
' OR 1=1--                    -- always true: matches every row
' ORDER BY 3--               -- increase until it errors -> finds the column count
' UNION SELECT username, password FROM users--   -- needs matching columns + types
```

## The Assignments

Do them in order. Every lab has a hint and a full solution: **try it yourself first**, then read the explanation. The green "solved" banner is your proof.

### Easy: the video, in your own hands

**1. Retrieve hidden data**: https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data
Make the category filter show _unreleased_ products too. Think about what `'--` does to `AND released = 1`.

**2. Login bypass**: https://portswigger.net/web-security/sql-injection/lab-login-bypass
Log in as `administrator` with `administrator'--` and a blank password. Explain why the password check disappears.

**3. UNION: retrieve data from other tables**: https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables
Pull `username` and `password` from `users`, then log in as `administrator`. This one has two text columns; the next section is finding that out yourself.

---

### Medium: how a UNION attack is really built

**4. Determine the number of columns**: https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns
Use `ORDER BY n--` or `UNION SELECT NULL,NULL,...--`. Note which number first errored, and why that tells you the count.

**5. Find a column containing text**: https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text
Swap one `NULL` at a time for `'a'` until the page accepts it. Why does a UNION fail if text lands where a number is expected?

**6. Retrieve multiple values in a single column**: https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-multiple-values-in-single-column
Only one usable column: concatenate with a separator, e.g. `' UNION SELECT NULL, username || '~' || password FROM users--`.

---

### Challenging (optional)

**7. Examine the database**: https://portswigger.net/web-security/sql-injection/examining-the-database
Find the DB type/version (syntax differs per database, use the cheat sheet), then query `information_schema.tables` / `.columns` to find and dump the credentials table.

**8. Blind SQL injection**: https://portswigger.net/web-security/sql-injection/blind/lab-conditional-responses
The result is never shown. Compare `' AND 1=1--` vs `' AND 1=2--`, then use `SUBSTRING` to read the password one character at a time.

**9. Now defend it (most important).** Put this broken endpoint in `vulnerable.ts`, then write a safe `secure.ts`:

```ts
// user input concatenated straight into the SQL string -- DO NOT do this
const result = await pool.query(
  `SELECT name, description FROM products WHERE category = '${req.query.category}' AND released = 1`,
);
```

Your fix must: use a parameterized query (`$1`), add a Zod schema for `req.query` (an `z.enum([...])` of allowed categories is ideal), and comment on why `$1` stops the attack but concatenation doesn't and why `ORDER BY`/column names can't be parameterized and need a whitelist instead. **Bonus:** try your Lab 1 payload against it and confirm it does nothing.
