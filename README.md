# HTTP & Express Homework

### Practice Based on Class Code

In class we built a restaurant API with `GET` routes, route parameters, and a nested `categories` object. For this homework, use that same structure as your blueprint, but **rebuild it around a topic you're personally interested in** instead of a restaurant.

Pick something that excites you. Here are a few ideas:

- Your favorite video game (categories = type of game, characters, levels)
- A sports league or team (categories = players, positions, stats)

* Movies or a TV show (categories = characters, seasons, genres)
* Music (categories = artists, albums, genres)
* Books (categories = genres, authors, series)

Whatever you pick, make sure your data has at least 3 to 4 categories, each containing an array of items, just like `menu.categories` did in class. Create a repo and branch it to: `week5/http-express`.

Your goal across all 9 tasks is the same: Take what we covered in class: GET routes, route parameters, and status codes, and use them to grow your own API into something more complete.

Please note:

- Every task below uses `GET` only as we haven't covered POST, PUT, PATCH, or DELETE yet, so save those for a future assignment.
- The tasks get progressively harder: Tasks 1–3 are easy, 4–6 are medium, and 7–9 are challenging and optional.

## Resources

- Useful Websites:
  - https://expressjs.com/en/starter/basic-routing.html
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
  - https://docs.insomnia.rest/insomnia/send-your-first-request
  - https://www.npmjs.com/package/nodemon

### Key Concepts

```ts
/*
app.get(path, handler)   // read/retrieve data — safe, repeatable, never changes anything

req.params   // values pulled from the URL itself, e.g. /items/:category
req.query    // values from after the ?, e.g. /items?sort=asc
res.json()   // send a JSON response
res.status(code)  // set the HTTP status code before responding

Common status codes for GET requests:
200 OK           — success, here's your data
404 Not Found    — that resource doesn't exist
500 Internal Server Error — something broke on the server
*/
```

## Easy (Tasks 1–3)

### Task 1: About Route

Add a `GET /about` route that responds with a JSON object describing your topic: a title, a short description, and one or two fun facts (make up believable details, just like the restaurant's name/address/hours).

### Task 2: Single Category

Add a `GET /items/:category` route that uses a route parameter (`req.params.category`) to return only the items in that category (e.g. `/items/characters` returns just the characters array). Feel free to rename `/items` to match your theme (e.g. `/roster`, `/tracklist`, `/lineup`).

### Task 3: Testing With Insomnia

Test all your `GET` routes (`/`, your main data route, `/items/:category`, and `/about`) in Insomnia. Confirm each one returns a `200` status code and the correct data.

## Medium (Tasks 4–6)

### Task 4: Handling a Missing Category

Update your `/items/:category` route so that if someone requests a category that doesn't exist (e.g. `/items/villains` when you don't have one), it responds with a `404` status code and a friendly error message like `"Category not found"`, instead of crashing or returning `undefined`.

### Task 5: Single Item Lookup

Add a `GET /items/:category/:item` route that returns just one item from within a category by its position/index or name (e.g. `/items/characters/mario`). If the category or the item isn't found, respond with a `404` and a clear message.

### Task 6: Query Parameters

Add a `GET /search` route that reads a query parameter (e.g. `/search?name=mario`) using `req.query`, and searches across **all** categories to find and return any matching items. If nothing matches, respond with a `404` and a message like `"No items found matching that search"`.

## Challenging — Optional (Tasks 7–9)

### Task 7: Sorting

Extend `/search` (or add a new `GET /items/sorted`) so it accepts a query parameter like `?order=asc` or `?order=desc` and returns your full dataset with each category's items alphabetically sorted in that direction.

### Task 8: Combining Params and Query Strings

Update your `/items/:category` route so you can also pass a query string like `/items/characters?contains=mar` to filter items within that category by a substring — combining both `req.params` and `req.query` in one route.

### Task 9: Document Your API

Write a short `README.md` that lists every route you built (method, path, what it does, and an example request/response, including what happens on a `404`). Then test each route in Insomnia and paste a screenshot showing the correct status code for each one.

## When You Finish

Push your updated project to the same GitHub repository you used, but to this branch: week5/http-express

Good luck, and remember: a well-tested API with correct status codes will make it much easier for other developers (and future you) to trust your endpoints, no matter what topic you built it around!
