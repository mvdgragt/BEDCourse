# Week 11 – Catching Bugs in Production with Sentry

**Video:** [Find and Fix Bugs with Sentry](https://www.youtube.com/watch?v=ueSddUv8ipk)

So far you have caught bugs **before** your code runs: with unit tests, integration tests, and Zod checking every value at the door. But no test suite catches everything. Databases go down, users send input nobody expected, and code that worked yesterday breaks today.

**Sentry** is the emergency call centre for your app. When something breaks, Sentry gets the call: it writes down what happened, where and when, groups the same problems together, and alerts you, ideally before your users notice.

This week you add Sentry to your own Express API (the one with Prisma and Winston from the lessons), and you practise being the detective: reading an error report, finding the line that broke, fixing it, and closing the case.

---

## Learning goals

After this assignment you can:

- Explain what error monitoring is, and how it differs from testing and from logging
- Set up Sentry in an Express app, with the DSN kept in `.env`
- Send errors to Sentry with `captureException`
- Add context with breadcrumbs and tags, and use them in the dashboard
- Decide which errors belong in Sentry and which don't
- Use a Sentry issue to find, fix and resolve a real bug

---

## Before you start

1. Create a new branch: `week11`
2. Make sure your Express API runs and can talk to the database
3. Create a free Sentry account at [sentry.io](https://sentry.io). Choose **EU** as the data storage location, like in the video
4. Create a new project and choose **Express** as the platform

### How to work

- **Small steps.** Change one thing, trigger an error, check the dashboard. Just like red → green, you want to see each step work before you take the next.
- **Commit every step**, with clear messages like `add Sentry error handler` or `add breadcrumbs to items routes`.
- **Answer every question** marked **Question:** in `ANSWERS.md`, in full sentences.
- **Take screenshots** of the Sentry dashboard where the exercise asks for them, and put them in a `screenshots/` folder.

---

## Easy

### Exercise 1: Install the alarm system

1. Install the Sentry SDK:

   ```bash
   npm install @sentry/node
   ```

2. Create `instrument.js` (or `instrument.ts`) and initialise Sentry. The DSN must come from your `.env` file, **not** be written in the code:

   ```js
   import "dotenv/config";
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
   });
   ```

3. Add `SENTRY_DSN=...` to your `.env` file. Check that `.env` is in `.gitignore`.
4. Add `SENTRY_DSN=` (with no value) to a `.env.example` file, so your teammates know the variable exists.
5. Import `instrument.js` on the **very first line** of `index.ts`, before Express and everything else.

> In the video, Sentry didn't receive anything at first because of two small mistakes: the `.env` file wasn't loaded, and the variable was spelled `DNS` instead of `DSN`. That's why `instrument.js` loads `dotenv/config` itself. If nothing arrives in your dashboard, check the spelling first.

**Question:** Why must `instrument.js` be imported before everything else?

**Question:** Why do we keep the DSN in `.env` instead of in the code?

### Exercise 2: Your first error report

1. Add a test route to your app:

   ```js
   app.get("/debug-sentry", (req, res) => {
     throw new Error("My first Sentry error!");
   });
   ```

2. Add the Sentry error handler **after all your routes**:

   ```js
   Sentry.setupExpressErrorHandler(app);
   ```

3. Start your server and open `http://localhost:3000/debug-sentry` in the browser or in Insomnia.
4. Find the error in your Sentry dashboard. Take a screenshot.
5. Open the issue and find:
   - the file and line number where the error was thrown
   - your Node.js version
   - your operating system
   - the environment

**Question:** You didn't add any extra information to this error yourself. List everything Sentry recorded anyway.

### Exercise 3: Order matters

In the video, the Sentry error handler had to go **after** all the routes, but **before** any other error middleware. Find out why, by breaking it on purpose:

1. Move `Sentry.setupExpressErrorHandler(app)` so it's **above** your routes.
2. Visit `/debug-sentry` again. Does a new event arrive in Sentry?
3. Move the handler back to its correct place, and check that events arrive again.

**Question:** What happened when the handler was above the routes, and why? (Think about the order in which Express runs middleware.)

---

## Medium

### Exercise 4: Catch the errors you already catch

Most of your routes have a `try/catch`, like the `GET /items` route in the video. When an error is caught there, your route sends a response itself, so the error never reaches Sentry's error handler.

1. Add `Sentry.captureException(error)` to the `catch` block of **every route** that talks to the database.
2. Break the database connection on purpose, for example by changing one letter of the database password in `.env`, like in the video.
3. Call each route in Insomnia. Check that every route shows up in Sentry.
4. Fix the password. Check that the routes work again, then mark the issues as **Resolved** in the dashboard. Take a screenshot.

**Question:** Why didn't the errors inside your `try/catch` reach `setupExpressErrorHandler` by themselves?

**Question:** Several requests failed for the same reason. Did Sentry show them as separate issues, or group them? Why is that useful?

### Exercise 5: Breadcrumbs and tags

The video compared **breadcrumbs** to little notes that tell the story before the crash, and **tags** to stickers you can filter on later.

In each database route:

1. Add a breadcrumb at the start of the route:

   ```js
   Sentry.addBreadcrumb({
     message: "Fetch items route",
     level: "info",
   });
   ```

2. Add a tag that says which part of the app it is:

   ```js
   Sentry.setTag("feature", "items");
   ```

   Use a different `feature` value for each group of routes, for example `items`, `users` or `orders`.

3. Break the database connection again, and call routes from at least **two different features**.
4. Open an issue and find your breadcrumb and your tag. Take a screenshot.
5. In the Issues search bar, filter on one feature, for example `feature:items`. Take a screenshot.

**Question:** Explain the difference between a breadcrumb and a tag in your own words. Give one example of when each one would help your team.

### Exercise 6: One helper instead of copy-paste

By now, every `catch` block probably looks almost the same: set a tag, send to Sentry, log with Winston, send a 500 response. That's a lot of copy-paste, and copy-paste is where bugs hide.

1. Create a helper function, for example in `utils/reportError.js`:

   ```js
   export const reportError = (error, feature) => {
     // set the tag, capture the exception, and log it with Winston
   };
   ```

2. **Refactor:** replace the repeated code in every `catch` block with a call to `reportError(error, "items")`.
3. Break the database connection once more, and check that Sentry and Winston still receive everything, with the right tags.

**Question:** You now send each error to both Winston and Sentry. What does each tool give you that the other doesn't?

---

## Challenging

### Exercise 7: Not every error belongs in Sentry

Last week you used Zod to check input. When a user sends a bad request body, that's **the user's mistake**, not a bug in your code. If every bad request ended up in Sentry, the real bugs would drown in the noise.

1. Add a Zod schema to one of your `POST` routes, for example `POST /items`.
2. In the `catch` block, check what kind of error it is:
   - A `ZodError` returns status **400** with a clear message, and is **not** sent to Sentry
   - Any other error returns status **500** and **is** sent to Sentry with `reportError`

   > **Hint:** `import { ZodError } from "zod";` and then `if (error instanceof ZodError) { ... }`.

3. Test both paths:
   - Send an invalid body. You get a 400, and **nothing** new appears in Sentry
   - Break the database connection and send a valid body. You get a 500, and the error **does** appear in Sentry

**Question:** Why is it a problem if Sentry fills up with errors that aren't bugs? Think about what happens when you get 200 alert emails a day.

**Question:** Name one other kind of error that shouldn't go to Sentry, and one that always should.

### Exercise 8: Development or production?

Your errors from testing on your own laptop shouldn't mix with errors from real users.

1. Add an `environment` to `Sentry.init`:

   ```js
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV || "development",
   });
   ```

2. Trigger an error with `NODE_ENV=development`, then one with `NODE_ENV=production`.
3. In the dashboard, filter the issues by environment. Take a screenshot.
4. The `/debug-sentry` route shouldn't exist in production. Make sure it's only added when the environment is **not** production.

**Question:** Why would a team want to see development and production errors separately?

**Question:** What could go wrong if `/debug-sentry` were left open in production?

### Exercise 9: Be the detective

Add this route to your app. Change `item` and `name` to match your own Prisma model if needed.

```ts
app.get("/items/:id", async (req, res) => {
  Sentry.addBreadcrumb({
    message: `Fetch item ${req.params.id}`,
    level: "info",
  });

  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(req.params.id) },
    });

    res.json({ ...item, name: item.name.toUpperCase() });
  } catch (error) {
    reportError(error, "items");
    res.status(500).json({ error: "Something went wrong" });
  }
});
```

It works for every item that exists. Your job is to find out what happens otherwise, **using only Sentry**.

1. Call the route with an ID that exists. It works.
2. Call it with an ID that doesn't exist, for example `999999`. You get a 500.
3. **Don't look at the code yet.** Open the issue in Sentry. Use the error message, the stack trace and the breadcrumb to work out:
   - which line broke
   - what the error message means
   - which ID caused it
4. Fix the route. A missing item should return **404** with a clear message, not a 500. And since a missing item isn't a bug, it shouldn't go to Sentry either.
5. Also call the route with `/items/abc`. What happens? Use what you learned in Exercise 7 to make it return a **400** instead.

   > **Hint:** `z.number().int().positive().parse(Number(req.params.id))` throws a `ZodError` when the ID isn't a positive whole number.

6. Check that all three cases work: an existing ID returns 200, a missing ID returns 404, and `abc` returns 400. Then mark the issue as **Resolved** in Sentry.

**Question:** Write a short incident report in `ANSWERS.md`, with four parts:

- **What happened:** what the user did, and what they saw
- **How Sentry helped:** which information in the issue pointed you to the bug
- **The fix:** what you changed, and why
- **Prevention:** how could you have caught this bug before it reached Sentry? Think back to the last few weeks.

> **Good to know:** your editor may show a warning under `item.name`, saying that `item` is possibly `null`. That warning is a clue! Like last week, TypeScript warned you while writing the code, but the code still ran. Sentry caught the error at runtime.

---

## Additional reading

### Watch and read first

- [Find and Fix Bugs with Sentry](https://www.youtube.com/watch?v=ueSddUv8ipk): this week's video.
- [Sentry for Express](https://docs.sentry.io/platforms/javascript/guides/express/): the official setup guide, including `instrument.js` and `setupExpressErrorHandler`.

### Read for the exercises

- [Capturing errors](https://docs.sentry.io/platforms/javascript/guides/express/usage/): `captureException` and `captureMessage`. Useful for Exercise 4.
- [Breadcrumbs](https://docs.sentry.io/platforms/javascript/guides/express/enriching-events/breadcrumbs/): what breadcrumbs are and which ones Sentry adds by itself. Useful for Exercise 5.
- [Tags](https://docs.sentry.io/platforms/javascript/guides/express/enriching-events/tags/): adding tags and searching on them. Useful for Exercise 5.
- [Environments](https://docs.sentry.io/platforms/javascript/guides/express/configuration/environments/): separating development and production. Useful for Exercise 8.

### Background

- [DSN explainer](https://docs.sentry.io/concepts/key-terms/dsn-explainer/): what the DSN is, and what it can and can't be used for.
- [ES modules setup](https://docs.sentry.io/platforms/javascript/guides/express/install/esm/): if you use `import` syntax, Sentry recommends loading `instrument.js` with Node's `--import` flag. Importing it on the first line, as in the video, is enough for catching errors. If you see a warning that Express is "not instrumented", this page explains why.

---

## What to hand in

Push your `week11` branch with:

- [ ] `instrument.js` that reads the DSN from `.env`
- [ ] `.env.example` with `SENTRY_DSN=` and **no** real `.env` in the repository
- [ ] `setupExpressErrorHandler` after all routes
- [ ] `utils/reportError.js` used in every `catch` block
- [ ] The Zod check from Exercise 7 and the fixed `/items/:id` route from Exercise 9
- [ ] `ANSWERS.md` with every **Question:** answered, including the incident report
- [ ] A `screenshots/` folder with the screenshots from Exercises 2, 4, 5 and 8
- [ ] A commit history with small, clear steps

If you get stuck, write down what you tried and where it broke. An honest "I got stuck here" is worth more than a copied solution.
