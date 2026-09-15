# HTTP & Express Homework - Week 5: CRUD Edition

### Practice Based on Class Code

In the last homework you built static `GET`-only routes around your own topic. In class this week we moved on to full CRUD (`GET`, `POST`, `PUT`, `DELETE`) using an in-memory `books` array as our example.

For this homework, use that same pattern as your blueprint, but **rebuild it around the 2026 Swedish general election (riksdagsval)** instead of books. Create a repo and branch it to: `week6/http-express-crud`.

Your data should be an in-memory array of objects, structured like this:

```ts
type Party = {
  id: number;
  name: string;
  leader: string;
  seats: number;
};

type PartyParams = {
  id: string;
};

let parties: Party[] = [
  { id: 1, name: "Socialdemokraterna", leader: "Example Name", seats: 107 },
  { id: 2, name: "Moderaterna", leader: "Example Name", seats: 68 },
];
```

(Feel free to look up real party names, leaders, and seat counts from the most recent Riksdag election for realism — just don't stress about getting every number perfectly up to date.)

Every task below builds on the `app.get`, `app.post`, `app.put`, `app.delete`, `res.json`, `res.send`, and `res.status` patterns we used in class with the `/books` routes. Tasks 1–3 are easy, 4–6 are medium, and 7–9 are challenging and optional.

## Resources

- Class tutorial and code (CRUD / books example)
- https://expressjs.com/en/starter/basic-routing.html
- https://expressjs.com/en/4x/api.html#req.body
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- https://docs.insomnia.rest/insomnia/send-your-first-request
- https://www.npmjs.com/package/express

### Key Concepts

```ts
/*
app.get(path, handler)     // read/retrieve data
app.post(path, handler)    // create new data
app.put(path, handler)     // update existing data
app.delete(path, handler)  // remove data

req.body     // data sent in the request body (needs app.use(express.json()))
req.params   // dynamic values in the URL, e.g. /parties/:id

Status codes to think about this time:
200 OK           — success, here's your data
201 Created      — something new was successfully created
400 Bad Request  — the request body was missing required fields
404 Not Found    — that resource doesn't exist (e.g. no party with that id)
500 Internal Server Error — something broke on the server
*/
```

## Easy (Tasks 1–3)

### Task 1: List All Parties

Build a `GET /parties` route that returns the full `parties` array with `res.json`.

### Task 2: Add a New Party

Build a `POST /parties` route that reads `name`, `leader`, and `seats` from `req.body`, creates a new `Party` object with a new `id`, pushes it into the array, and responds with a confirmation message and the new party.

### Task 3: Testing With Insomnia

Test both routes in Insomnia. For `GET /parties`, confirm you get `200` and the array looks right. For `POST /parties`, send a JSON body with a new party and confirm the response includes it.

## Medium (Tasks 4–6)

### Task 4: Update a Party's Info

Build a `PUT /parties/:id` route. Find the party by `id` (parsed from `req.params`), update whichever fields (`name`, `leader`, `seats`) were sent in `req.body`, and return the updated party. If no party matches that `id`, respond with `404` and a helpful message.

### Task 5: Remove a Party

Build a `DELETE /parties/:id` route that removes the matching party from the array and responds with a confirmation message.

### Task 6: Handling Bad Input

Update your `POST /parties` route so that if `name` or `leader` is missing from `req.body`, it responds with `res.status(400).json(...)` and an error message instead of creating a broken party. Test this in Insomnia by sending an incomplete body on purpose.

## Challenging => Optional (Tasks 7–9)

### Task 7: Explicit Status on Create

Make sure your `POST /parties` route explicitly responds with `res.status(201).json(...)` on success, since `201` (not `200`) is the correct code for "something was created." Confirm this in Insomnia.

### Task 8: A Seats Total Route

Add a `GET /parties/seats-total` route that adds up the `seats` field across every party in the array and returns it as JSON, e.g. `{ totalSeats: 349 }`.

> Note: route order matters here. This route needs to be declared _before_ any `GET /parties/:id` route you might add, or Express will try to match `"seats-total"` as an `:id`.

### Task 9: Document Your API

Write a short `README.md` listing every route you built (method, path, expected request body if any, what it returns, and the status codes you tested in Insomnia, both the success case and at least one error case like `404` or `400`). Paste an Insomnia screenshot for each route as proof.

## When You Finish

Push your updated project to the same GitHub repository, on the branch: `week5/http-express-crud`

Good luck — you've now built a full CRUD API, which is the same basic shape behind most real-world backends you'll ever work with!
