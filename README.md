# Fetch Random Person API Homework (with Challenge)

### Practice Based on Class Code

In class we learned how to use **Zod** to validate data, connect it with **Express**, and pull data from a real external API (the Random User Generator). For this homework, you'll build on that same pattern; instead you'll fetch **different fields** from the API and build out a few new routes of your own.

Your goal across all phases is the same: take what we covered in class (`fetch`, Zod schemas, `safeParse`, and status codes) and use them to build a small, well-validated API around the Random User Generator.

## Goal

Practice fetching data from an external API (the [RandomUser API](https://randomuser.me/)) using Express and TypeScript, and validating it with Zod. You will fetch different data from the API than we did in the example, and create new routes from scratch.

**Video:** https://youtu.be/GpuojVxrMdw

## Project Outline

```
server/
  └── server.ts   : main server file
```

**Routes to implement:**

- `GET /random-person`: fetch a random person and return their full name and country
- `POST /users`: accept a user object, validate it using Zod (name, age, email)
- _(Optional)_ `GET /random-address`: fetch a random user and return their city and postcode

## Resources

-

- Useful Websites:
  - https://expressjs.com/en/starter/basic-routing.html
  - https://randomuser.me/documentation
  - https://zod.dev/
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  - https://docs.insomnia.rest/insomnia/send-your-first-request

### Key Concepts

```ts
/*
fetch(url)                 // call an external API from your server
schema.safeParse(data)     // validate data against a Zod schema without throwing
res.status(code)           // set the HTTP status code before responding
res.json()                 // send a JSON response

Common status codes for this assignment:
200 OK                      : success, here's your data
201 Created                 : a new resource (user) was created successfully
400 Bad Request             : the data sent to the server was invalid
500 Internal Server Error   : something broke on the server (e.g. the external API failed)
*/
```

## Skill 1: Minimal Server & Ping

Create `server.ts` and import Express. Start the server listening on `PORT 3000`.

Add a `GET /ping` route that responds with a JSON object: `{ message: 'pong' }`. This confirms your server is up and running before you build anything else.

## Skill 2: Fetch a Random Person

Add a `GET /random-person` route that:

- Uses `fetch` to call `https://randomuser.me/api/`
- Validates the response shape with a Zod schema (don't trust the external data blindly!)
- Returns just the person's **full name** and **country** (not the email this time)
- Responds with `500` and a clear error message if the fetched data fails validation, or if the fetch itself fails

## Skill 3: User Signup Route (POST)

Add a `POST /users` route that accepts an object with `name`, `age`, and `email`.

Validate it with a Zod schema using these rules:

- `name`: a string between 3 and 12 characters
- `age`: optional; if provided, must be between 18 and 100; defaults to 28 if not provided
- `email`: must be a valid email address, and should be normalized to lowercase

If validation succeeds, respond with `201` and the validated user object. If it fails, respond with `400` and the Zod error details.

## Skill 4 Challenge (Optional)

### Fetch Additional Data: `/random-login`

Add a `GET /random-login` route that:

- Fetches a random user from the RandomUser API
- Validates the response with Zod to make sure the fields you need actually exist
- Returns the user's **username** and **registered date**

**Bonus:** Instead of returning raw JSON, include a short summary string in the response, formatted like:

```
"grumpykoala42 (registered on 2014-03-11)"
```

## When You Finish

Test all your routes in Insomnia and confirm each one returns the correct status code and data, including the `400` and `500` error cases. Push your project to your GitHub repository, use for example the following branch: week6/zod

Good luck, and remember: validating the data you send _and_ receive is what keeps a real-world API from crashing on the first weird input someone throws at it!
