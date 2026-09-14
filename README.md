# HTTP & Express Homework

### Practice Based on Class Code

In class we built a restaurant server with two `GET` routes: one that sends plain text (`res.send`) and one that sends a nested JSON object (`res.json`). For this homework, use that same pattern as your blueprint, but **rebuild it around a topic you're personally interested in** instead of a restaurant.

Pick something that excites you. Here are a few ideas:

- Your favorite video game (categories = genre, characters, levels)
- A sports league or team (categories = players, positions, stats)
- Movies or a TV show (categories = characters, seasons, genres)
- Music (categories = artists, albums, genres)
- Books (categories = genres, authors, series)
  Whatever you pick, structure your data the same way `menu` was structured in class: a top-level object with a name/title, a nested `categories` object where each key holds an array of items, and a `lastUpdated` field. Create a repo and branch it to: `week5/http-express`.

Your goal across all 9 tasks is the same: **take exactly what we covered in class: `app.get`, `res.send`, `res.json`, and nested objects and use it to build a couple more routes for your own topic.** Every task below uses `GET` only, and every route is static (no dynamic parameters), just like the two routes we wrote together. The tasks get progressively harder: Tasks 1–3 are easy, 4–6 are medium, and 7–9 are challenging and optional.

## Resources

- Class tutorial and code:
- https://youtu.be/6OmfZxCh388?si=ZM7JPLTAS5dPejPx
- https://github.com/mvdgragt/BEDCourse/tree/week5/http-express

- Useful Websites:
  - https://expressjs.com/en/starter/basic-routing.html
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  - https://docs.insomnia.rest/insomnia/send-your-first-request
  - https://www.npmjs.com/package/nodemon
  - https://www.npmjs.com/package/express

### Key Concepts

```ts
/*
app.get(path, handler)   // read/retrieve data — safe, repeatable, never changes anything
res.send()               // send back a plain text/HTML response
res.json()               // send back a JSON response
res.status(code)         // explicitly set the HTTP status code before responding
 
Status codes we talked about:
200 OK           — success, here's your data
201 Created      — something new was successfully created
400 Bad Request  — the request was malformed
401 Unauthorized — you need to log in / show credentials
404 Not Found    — that resource doesn't exist
500 Internal Server Error — something broke on the server
503 Service Unavailable   — the server is too busy right now
*/
```

## Easy (Tasks 1–3)

### Task 1: Homepage Route

Just like `app.get("/")` sent back `"Welcome to our restaurant"`, add your own homepage route that sends a plain text welcome message related to your topic, using `res.send`.

### Task 2: Main Data Route

Just like `app.get("/menu")` returned a JSON object with a title, nested `categories`, and a `lastUpdated` field, build your own equivalent route (e.g. `/roster`, `/tracklist`, `/collection`) that returns your topic's data using `res.json`, with at least 3 categories and a `lastUpdated` field generated the same way we did in class (`new Date().toISOString().split("T")[0]`).

### Task 3: Testing With Insomnia

Test both of your routes in Insomnia. Confirm each one returns a `200` status code, and check that your JSON route's response body looks the way you expect.

## Medium (Tasks 4–6)

### Task 4: A Second JSON Route

Add another `GET` route (like `/about`) that returns a JSON object with different information about your topic, not menu-style categories this time, just a few descriptive fields (e.g. `title`, `description`, `founded`, `funFact`).

### Task 5: Comparing Response Types

Add one more `GET` route that deliberately uses `res.send` with a plain string, and explain in a short code comment why you'd choose `res.send` over `res.json` for that particular route.

### Task 6: Matching Status Codes to Scenarios

Without changing your code yet, write a short comment above each of your routes describing what status code Insomnia _should_ show when the request succeeds, and what status code you'd expect if the route didn't exist at all (try requesting a route you never built and see what Insomnia shows you).

## Challenging => Optional (Tasks 7–9)

### Task 7: Setting Status Codes Explicitly

Pick one of your routes and rewrite it to explicitly set its status using `res.status(200).json(...)` instead of relying on the default. Confirm in Insomnia that the response still shows `200`.

### Task 8: A Deliberate Error Response

Add a small "maintenance mode" route (e.g. `/maintenance`) that always responds with `res.status(503).send("We're down for maintenance, check back soon!")`, just to practice sending a non-200 status code on purpose. Test it in Insomnia and confirm you see `503`.

### Task 9: Document Your API

Write a short `README.md` listing every route you built (method, path, what it returns, and the status code you saw in Insomnia). Paste a screenshot from Insomnia for each route as proof.

## When You Finish

Push your updated project to the same GitHub repository you used but to this branch: week5/http-express

Good luck, and remember: even simple static routes are real, working APIs, you're already doing the same thing large-scale servers do, just on a smaller scale!
