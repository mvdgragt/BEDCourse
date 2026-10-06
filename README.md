# Zod & ESLint Homework: Validating and Linting Your Express API

### Practice Based on Class Code

Last week we connected **Express** to **PostgreSQL** and built a CRUD API for our library. This week we made that API safer and cleaner with two tools we looked at before:

- **ESLint** reads our code _before_ it runs and finds problems, such as unused variables, missing braces, missing semicolons and inconsistent quotes. We set it up with `npm init @eslint/config@latest`, added our own **rules**, and run it with `npm run lint`.
- **Zod** checks that data has the shape we expect _while_ the app runs. We wrote an `athleteSchema` with `z.object()`, `z.string().min().max()` and `z.number()`, used `safeParse()` on `req.body`, and sent back a `400` when the data was wrong.

We also used Zod to validate our **environment variables** (and stop the server with `process.exit(1)` if they're missing), used `z.infer` to get a **TypeScript type** from a schema, and fixed the `error is of type unknown` problem with `err instanceof Error`.

This week you'll add all of this to **your own library API** from last week.

## Goal

Move your Express API to TypeScript, lint it with ESLint, and validate every piece of incoming data (body, URL params, query parameters and environment variables) with Zod.

**Videos:**

- Part 4 (Connecting PostgreSQL to Express): https://www.youtube.com/watch?v=frTlOUg3-Ik
- Part 5 (Adding Zod and ESLint to our Express application): https://youtu.be/YqLxEN_FF90

## Project Outline

```
week8-zod-eslint/
  ├── compose.yml        : your Postgres + pgAdmin containers (from last week)
  ├── .env               : your environment variables (NOT on GitHub!)
  ├── .env.example       : the same keys with fake values (this one DOES go on GitHub)
  ├── .gitignore         : node_modules, dist and .env
  ├── package.json       : with "dev", "lint" and "typecheck" scripts
  ├── tsconfig.json      : TypeScript settings
  ├── eslint.config.ts   : your ESLint config and rules
  ├── init.sql           : your tables and test data
  └── src/
      ├── index.ts       : your Express server and routes
      ├── db.ts          : your connection pool
      ├── env.ts         : your validated environment variables
      ├── schemas.ts     : all your Zod schemas and types
      └── middleware/
          └── validate.ts : (challenge 7) your validation middleware
```

## Resources

- Extra Reading:
  - **Zod**:
    - Introduction: https://zod.dev/
    - Basic usage (`parse` vs `safeParse`): https://zod.dev/basics
    - All schema types (`z.string()`, `z.number()`, `z.enum()`, `z.coerce` ...): https://zod.dev/api
    - Customizing error messages: https://zod.dev/error-customization
    - Formatting errors (`z.flattenError`, `z.treeifyError`): https://zod.dev/error-formatting
  - **ESLint**:
    - Getting started: https://eslint.org/docs/latest/use/getting-started
    - All rules: https://eslint.org/docs/latest/rules/
    - Configuration files: https://eslint.org/docs/latest/use/configure/configuration-files
  - **typescript-eslint**: https://typescript-eslint.io/getting-started
  - **ESLint Stylistic** (challenge 9): https://eslint.style/
  - **TypeScript `unknown`**, and why `catch (err)` isn't an `Error` by default: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
- Useful Websites:
  - https://node-postgres.com/
  - https://expressjs.com/en/guide/routing.html

**Read before you start:** the Zod _Basic usage_ page and the ESLint _Getting started_ page. They're short!

### Key Concepts

```bash
npm install zod                          # Zod is a normal dependency (it runs in production!)
npm install -D typescript tsx @types/node @types/express @types/pg
npm init @eslint/config@latest           # answer the questions like in the video
# no typescript-eslint in package.json? Install it yourself:
npm install -D eslint @eslint/js typescript typescript-eslint
npm run lint                             # find problems
npx eslint . --fix                       # let ESLint fix what it can by itself
```

```ts
import { z } from "zod";

// A schema describes what valid data looks like
const bookSchema = z.object({
  title: z.string().min(1, "A book needs a title").max(100),
  genre: z.string().max(50).optional(), // optional: it may be missing
  published_year: z.number().int().min(1000).max(2100),
});

// A TypeScript type, made from the schema for free
type Book = z.infer<typeof bookSchema> & { id: number };

// safeParse never throws: it gives you success + data OR success + error
const result = bookSchema.safeParse(req.body);
if (!result.success) {
  // send back the errors
}
result.data; // the validated data (only use THIS, not req.body!)
```

```ts
z.coerce.number(); // "5" → 5 (useful for req.params, req.query and .env)
z.enum(["title", "genre"]); // only these exact values are allowed
z.email(); // a valid email address
schema.partial(); // the same schema, but every field optional
z.flattenError(result.error); // turns an error into { formErrors, fieldErrors }
```

```ts
// catch (err) gives you "unknown", so check before you use it
function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}
```

## Skill 1: Move to TypeScript

Copy your library project from last week into a new folder. Then:

1. Install the packages from _Key Concepts_ above and create a `tsconfig.json` with `npx tsc --init`
2. Move your code into `src/` and rename `.js` files to `.ts`
3. Add scripts to `package.json`:

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit"
}
```

4. Run `npm run dev` and check that all your routes still work in Insomnia
5. Run `npm run typecheck` and fix the errors, such as `Request` and `Response` types on your routes and `error is of type unknown` in your `catch` blocks

**Tip:** `tsx` runs TypeScript directly, so you don't need to build first. `npm run typecheck` is what actually _checks_ your types, so run it often!

**Tip:** If TypeScript complains about `return res.status(400).json(...)`, write the response on one line and `return;` on the next line.

## Skill 2: The Assignments

Do the assignments in order; each one builds on the last. After **every** exercise, run `npm run lint` and `npm run typecheck`. Both should finish with **zero** errors before you move on.

### 🟢 Easy

**1. Set up ESLint**

- Run `npm init @eslint/config@latest` and choose: _syntax and problems_, _JavaScript modules_, _none of these_ (no React/Vue), _TypeScript: yes_, _Node_, and a _TypeScript_ config file
- Open `package.json` and check that `typescript-eslint` is in your `devDependencies`. The wizard installs it when you answer _TypeScript: yes_. If it's missing, install it like on the [typescript-eslint Getting Started page](https://typescript-eslint.io/getting-started): `npm install -D eslint @eslint/js typescript typescript-eslint`. Then make sure `tseslint.configs.recommended` is in your `eslint.config.ts`.
- Add `"lint": "eslint ."` to your scripts (if you didn't already in Skill 1)
- Add the rules from the video to `eslint.config.ts` in their own object:

```ts
{
  rules: {
    "@typescript-eslint/no-unused-vars": "error", // catch unused variables
    curly: "error",                               // braces around if/else
    semi: ["error", "always"],                    // require semicolons
    quotes: ["error", "double"],                  // consistent quotes
    indent: ["error", 2],                         // consistent indentation
    "object-curly-spacing": ["error", "always"],  // { like this }
  },
},
```

- Add `{ ignores: ["dist", "node_modules"] }` to the config as well
- Run `npm run lint` and fix every error. Try `npx eslint . --fix` first and see how many it fixes for you!
- Finally, turn on `"no-console": "warn"` and run the linter again. What happens? Then decide if you want to keep it, and write _why_ as a comment in the config.

**Why `@typescript-eslint/no-unused-vars` and not `no-unused-vars`?** The normal ESLint rule doesn't understand TypeScript types and can complain about things that are fine. The TypeScript version does understand them.

**2. Validate your environment variables**

Create `src/env.ts`, just like in the video:

- Write an `envSchema` with `DB_USER`, `DB_HOST`, `DB_DATABASE` and `DB_PASSWORD` as strings
- `DB_PORT` and `PORT` should use `z.coerce.number()` with a default (`5432` and `3000`)
- Use `safeParse(process.env)`. If it fails, log the error with `z.treeifyError()` and stop the server with `process.exit(1)`.
- Export the validated values and use them in `db.ts` and `app.listen`. You should no longer see `process.env` anywhere else in your code!
- Create a `.env.example` with the same keys but fake values, so a classmate knows what to fill in

**Test it:** Remove `DB_USER` from your `.env` and start the server. You should see a clear error instead of a confusing database error later on.

**3. Validate books in POST and PUT**

- Create `src/schemas.ts` with a `bookSchema` for your books (title, genre, published_year, and author_id if you did exercise 6 last week)
- Give `title` your own error messages, like in the video
- Use `bookSchema.safeParse(req.body)` in `POST /books` and `PUT /books/:id`, and use `.data` instead of `req.body`
- Remove the manual "is the title missing?" check from last week. Zod does that now!
- Send the errors back with `z.flattenError()` so the response is easy to read:

```json
{
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "title": ["A book needs a title"]
    }
  }
}
```

- Use `type Book = z.infer<typeof bookSchema> & { id: number };` with `pool.query<Book>(...)`
- Replace all `err.message` in your `catch` blocks with a `getErrorMessage(err)` helper

**Test it:** Send a book without a title, with `"published_year": "nineteen"` (a string!), and with an empty body `{}`.

### 🟡 Medium

**4. Validate URL params**

Last week you checked the id yourself with `Number.isInteger`. Replace that with Zod:

- Create an `idParamSchema` in `schemas.ts`: `z.object({ id: z.coerce.number().int().positive() })`
- Use it in **every** route with `:id`: `GET`, `PUT`, `PATCH` and `DELETE` for books, and your author and member routes if you have them
- `/books/abc`, `/books/-1` and `/books/1.5` should all give a `400`, not a `500`

**Think about it:** Why do we need `z.coerce` here, but not in the body schema? (Hint: what type is _everything_ in `req.params`?)

**5. PATCH with a partial schema**

Last week you used `COALESCE` for `PATCH /books/:id`. Now validate it too:

- Make `bookPatchSchema` from your `bookSchema` with `.partial()`, so every field becomes optional
- Sending `{ "genre": "classic" }` should pass, but `{ "published_year": "abc" }` should fail
- An empty body `{}` should also fail. Look up `.refine()` in the Zod docs and write a check like _"at least one field must be sent"_.

**6. Validate query parameters**

Remember the `allowedSorts` array from last week's exercise 4? Zod can do that for you.

- Create a `bookQuerySchema` for `GET /books`:
  - `genre`: optional string
  - `sort`: optional, but only one of your allowed columns. Use `z.enum([...])`.
  - `search`, `page` and `limit` (if you did exercise 8 last week): `page` and `limit` use `z.coerce.number()` with defaults, and `limit` has a maximum of 50
- Remove your old `allowedSorts` check
- `/books?sort=password` and `/books?limit=1000` should both give a `400` with a clear message

**Remember:** `z.enum` makes sure the value is safe, so it's now OK to use it as a column name in `ORDER BY`, because Zod guarantees it's one of _your_ values.

### 🔴 Challenging (optional)

**7. Write a validation middleware**

You probably now have the same five lines of `safeParse` code in almost every route. Let's fix that!

- Create `src/middleware/validate.ts` with a function `validate(schema, source)` that returns Express middleware
- `source` is `"body"`, `"params"` or `"query"`
- If validation fails, it sends a `400` with `z.flattenError()`. If it passes, it calls `next()`.
- Use it in your routes like this:

```ts
app.post("/books", validate(bookSchema, "body"), async (req, res) => { ... });
app.get("/books/:id", validate(idParamSchema, "params"), async (req, res) => { ... });
```

- **Extra:** Store the parsed data in `res.locals.validated` so your route can use the _coerced_ values (numbers instead of strings)

**Hint:** Look up the `z.ZodType` type for the `schema` parameter, and the `NextFunction` type from Express.

**8. Schemas for the whole library**

Validate every route in your API, including the authors, members and loans from last week's exercises 6 and 7:

- `authorSchema`: name between 2 and 50 characters
- `memberSchema`: name, and an `email` using `z.email()`. Turn the email into lowercase with `.toLowerCase()` before saving it, so `Anna@Mail.com` and `anna@mail.com` can't both sign up.
- `loanSchema`: `book_id` and `member_id` are positive whole numbers
- Make a type for each one with `z.infer` and use it in every `pool.query<...>()`
- Make sure **no** route uses `req.body`, `req.params` or `req.query` directly anymore, only validated data

**Think about it:** Zod checks that `book_id` is a number, but can Zod check that the book actually _exists_? Which part of your app is responsible for that? (Look back at your foreign key error handling from last week.)

**9. Make linting part of your workflow**

The ESLint website says you can run it in a _continuous integration pipeline_. Let's do that!

- The formatting rules from the video (`semi`, `quotes`, `indent`, `object-curly-spacing`) are **deprecated** in ESLint. Install `@stylistic/eslint-plugin` and move them to their `@stylistic/...` versions (see https://eslint.style/).
- Try typescript-eslint's stricter `recommendedTypeChecked` config. It finds things like a forgotten `await`, the exact bug from last week's video! Fix whatever it finds.
- Create `.github/workflows/lint.yml`, a GitHub Action that runs `npm ci`, `npm run lint` and `npm run typecheck` on every push. Check the **Actions** tab on GitHub to see it pass (or fail!).

**Try it yourself first!** The Zod and ESLint docs have examples for almost everything above. If you're stuck, `console.log` the result of `safeParse` like in the video: seeing what `success`, `data` and `error` look like helps a lot.

## When You Finish

Make sure:

- `npm run lint` and `npm run typecheck` both finish with **zero errors**
- Every route still works in Insomnia, and sending bad data gives a `400` with a clear message instead of a `500`
- Your server refuses to start with a missing environment variable
- `.env` is in `.gitignore`, and `.env.example` is on GitHub

Push your project to your GitHub repository on the following branch: `week8/zod-eslint-express`

Your submission should include `package.json`, `tsconfig.json`, `eslint.config.ts`, `.env.example`, `init.sql` and the `src` folder. In your pull request, write which exercises you completed.

Good luck! Remember: never trust data that comes from outside your app. ESLint protects you from _your own_ mistakes, and Zod protects you from everyone else's.
