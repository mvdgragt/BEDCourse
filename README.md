# Week 13 – A React Frontend for Your Library API

**Video:** [React + Vite frontend with an Express backend](https://www.youtube.com/watch?v=VSkWCl5DNLM)

Until now, you have tested your library API with Insomnia or the browser. Real users never do that. They click buttons on a web page, and the page talks to the API for them.

This week you build that page. You create a **React** frontend with **Vite**, next to the library API you have worked on for weeks (books, authors, members and loans, with Sequelize, Zod, Sentry and SonarQube). The frontend uses **Axios** to send requests to your API, and **CORS** to make sure the API allows those requests.

You start with the easy part: **reading** data and showing it on the page (`GET`). Then you make the page **change** data: create (`POST`), update (`PUT`) and delete (`DELETE`).

---

## Learning goals

After this assignment you can:

- Create a React + TypeScript project with Vite
- Explain what CORS is, and why the browser blocks requests between different ports
- Fetch data from your own API with Axios, `useEffect` and `useState`
- Show a list on the page with `.map()`, and explain why every item needs a `key`
- Send `POST`, `PUT` and `DELETE` requests from a form or a button
- Use Zod in the frontend to check a form before it is sent to the API
- Explain the difference between `PUT` and `PATCH`, and add a `PUT` endpoint to your API
- Keep the page in sync with the database after a change

---

## Before you start

1. Check out your `week11/sonarqube` branch, and make sure it is up to date.
2. Create a new branch from it: `week13/frontend`. You continue working on the same project, so your API, database and SonarQube setup come with you.
3. Start your API (`http://localhost:3000`) and check in Postman or Insomnia that these endpoints still work. You use them in this assignment:

   | Method   | Endpoint                         | Used in                   |
   | -------- | -------------------------------- | ------------------------- |
   | `GET`    | `/books`                         | Exercise 2, 3             |
   | `GET`    | `/authors`                       | Exercise 3, 4             |
   | `GET`    | `/stats` or `/authors/:id/books` | Exercise 3                |
   | `POST`   | `/books`                         | Exercise 4                |
   | `DELETE` | `/books/:id`                     | Exercise 5                |
   | `PUT`    | `/books/:id`                     | Exercise 6 (you build it) |

4. Your frontend goes in a **new folder** called `client`, in the root of your project. Your API code stays where it is.

> In the video, the API runs on port `8080` and has one endpoint, `/api`, that returns `{ cars: [...] }`. Your API runs on port `3000`, and `GET /books` returns `{ page, limit, total, data: [...] }`. The idea is the same: in the video the list is in `response.data.cars`, in your project it's in `response.data.data`.

### How to work

- **Small steps.** Get one thing working in the browser before you start the next one.
- **Two terminals.** One runs the API, one runs the client. Check which folder you are in before you run `npm install`. In the video, packages almost ended up in the wrong folder.
- **Commit every step**, with clear messages like `add vite client` or `add delete button`.
- **Answer every question** marked **Question:** in `ANSWERS.md`, in full sentences.
- **Take screenshots** where the exercise asks for them, and put them in a `screenshots/` folder.

---

## Easy

### Exercise 1: Create the client with Vite

1. From the root of your project, create the client:

   ```bash
   npm create vite@latest client
   ```

   Choose **React** and **TypeScript**.

2. Go into the folder, install, and start it:

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open the address Vite shows (usually `http://localhost:5173`). Click the counter button to check that React works.
4. Check that `client/node_modules` is ignored by Git. Vite creates its own `.gitignore` inside `client`, but check it.

**Question:** Your project now has two `package.json` files: one for the API and one for the client. Why? What would go wrong if you installed React in the API's `package.json`?

**Question:** What does Vite do for you while you run `npm run dev`? Try changing a text in `App.tsx` and saving. What happens in the browser?

### Exercise 2: Fetch the books and fix CORS

1. In the **client** folder, install Axios:

   ```bash
   npm install axios
   ```

2. In `App.tsx`, write a function that gets the books, and call it in a `useEffect` with an empty dependency array:

   ```tsx
   import { useEffect } from "react";
   import axios from "axios";

   function App() {
     const fetchBooks = async () => {
       const response = await axios.get("http://localhost:3000/books");
       console.log(response);
     };

     useEffect(() => {
       fetchBooks();
     }, []);

     return <h1>Library</h1>;
   }

   export default App;
   ```

3. Open the browser console. You get a **CORS error**. Take a screenshot of it.
4. In the **API** folder (the root of your project, not `client`), install `cors` and its types:

   ```bash
   npm install cors
   npm install --save-dev @types/cors
   ```

5. In your API's main file, allow requests from the client. Put it right after `app.use(express.json())`, **before** your routes:

   ```ts
   import cors from "cors";

   app.use(cors({ origin: "http://localhost:5173" }));
   ```

6. Refresh the client. The CORS error is gone, and you see the response object in the console.
7. Explore the object in the console, like in the video. Log `response.data`, then `response.data.data`. Which one is the list of books? Where do you find `total`? And where is the author's name?

> In the video, the data is logged twice, and the teacher says React is "testing first". What really happens: in development, React's `StrictMode` (in `main.tsx`) runs every effect twice on purpose, to help you find bugs. It doesn't happen in production.

**Question:** In your own words: what is CORS, and why did the browser block the request? Why did the same request work fine in Postman?

**Question:** Why do we write `origin: "http://localhost:5173"` instead of allowing every origin? What would you have to change when the frontend is put online?

### Exercise 3: Show the books on the page

1. Make a type for a book, so TypeScript knows what you get back. Check the console from Exercise 2: the field names must match exactly, including the name of the included author (Sequelize often calls it `Author`):

   ```ts
   type Book = {
     id: number;
     title: string;
     genre: string;
     published_year: number;
     author_id: number;
     Author?: { name: string };
   };
   ```

2. Store the books in state. Give `useState` the type, otherwise TypeScript thinks the array is always empty (`never[]`):

   ```tsx
   const [books, setBooks] = useState<Book[]>([]);
   ```

3. In `fetchBooks`, call `setBooks(response.data.data)` instead of `console.log`.
4. Show the books with `.map()`. Show at least the title, the author's name and the year:

   ```tsx
   <ul>
     {books.map((book) => (
       <li key={book.id}>
         {book.title} by {book.Author?.name} ({book.published_year})
       </li>
     ))}
   </ul>
   ```

5. Show `total` above the list, for example "12 books in the library".
6. Show data from at least **one more** `GET` endpoint in its own section on the page. Choose one:
   - `GET /authors`: a list of all authors
   - `GET /stats`: how many books there are per genre
   - `GET /authors/:id/books`: the books of one author
7. Add a book with Postman, refresh the client, and check that it shows up. Take a screenshot of the page.

> In the video, the `key` is put on the `<ul>`, and the index from `.map()` is used as key. The `key` belongs on the element **inside** the map (here the `<li>`), and the book's `id` is a better key than the index. You don't always need the index in `.map()`.

**Question:** Why does React need a `key` on every item in a list? Why is `book.id` a better key than the index, especially once you can delete books?

**Question:** Explain in your own words what `useState` and `useEffect` do in this component. What would happen if you removed the empty array `[]` from `useEffect`?

---

## Medium

### Exercise 4: Add a book with POST

Your API already has `POST /books`. It needs a `title`, `genre`, `published_year` and `author_id`, and it checks them with your `bookSchema`.

1. Add a form to the page with:
   - an input for the **title**
   - an input for the **genre**
   - a number input for the **published year**
   - a **dropdown** (`<select>`) with all authors from `GET /authors`. The user sees the name, but the value is the author's `id`
2. Store the form values in state, for example:

   ```tsx
   const [title, setTitle] = useState("");
   const [genre, setGenre] = useState("");
   const [publishedYear, setPublishedYear] = useState("");
   const [authorId, setAuthorId] = useState("");
   ```

3. When the form is submitted, send the new book to the API. Inputs always give you strings, so turn the numbers into numbers:

   ```tsx
   const handleSubmit = async (event: React.FormEvent) => {
     event.preventDefault();
     await axios.post("http://localhost:3000/books", {
       title,
       genre,
       published_year: Number(publishedYear),
       author_id: Number(authorId),
     });
     await fetchBooks();
     // empty the form here
   };
   ```

4. Check that the new book shows up on the page **without** refreshing, and that it is still there after you refresh (so it was really saved in the database).
5. Don't send a form the API will reject. You already use Zod in your API, so use it in the client too. In the **client** folder:

   ```bash
   npm install zod
   ```

6. Create `client/src/schemas.ts` with a schema for the form. Open your API's `src/schemas.ts` and copy the rules from `bookSchema`, so both sides agree on what a valid book is. Inputs always give you strings, so use `z.coerce.number()` for the numbers:

   ```ts
   import { z } from "zod";

   export const bookFormSchema = z.object({
     title: z.string().trim().min(1, "Title is required"),
     genre: z.string().trim().min(1, "Genre is required"),
     published_year: z.coerce.number().int().max(new Date().getFullYear()),
     author_id: z.coerce.number().int().positive("Choose an author"),
   });
   ```

7. In `handleSubmit`, check the form with `bookFormSchema.safeParse(...)` **before** you call `axios.post`. If it fails, don't send anything. Show the messages next to the fields, with `z.flattenError(result.error).fieldErrors`, like your API does. If it succeeds, send `result.data`: the numbers are already numbers.
8. Test it: leave the title empty, choose no author, type a year in the future. The form should explain what's wrong, and the **Network** tab in the browser should show that no request was sent. Take a screenshot.

> **Hint:** `z.flattenError` is Zod 4, the same as in your API. Check that the client installed the same major version (`npm ls zod` in both folders).

> **Hint:** `POST /books` sends back the new book, but **without** the author included. That's why the code above fetches the whole list again. Try `setBooks([...books, response.data])` instead and see what happens to the author's name.

**Question:** What does `event.preventDefault()` do? Remove it and test. What happens, and why?

**Question:** Why does the dropdown use the author's `id` as value and not the name? What could go wrong if the user typed the `author_id` by hand?

**Question:** Your book rules now live in two places: `src/schemas.ts` in the API and `client/src/schemas.ts` in the client. What could go wrong when someone changes one and forgets the other? Can you think of a way to keep them in one place?

### Exercise 5: Delete a book with DELETE

Your API already has `DELETE /books/:id`.

1. Add a **Delete** button next to every book in the list.
2. When it is clicked, send the request, and remove the book from the state:

   ```tsx
   const handleDelete = async (id: number) => {
     await axios.delete(`http://localhost:3000/books/${id}`);
     setBooks(books.filter((book) => book.id !== id));
   };
   ```

   ```tsx
   <button onClick={() => handleDelete(book.id)}>Delete</button>
   ```

3. Ask the user before deleting, for example with `window.confirm("Are you sure?")`.
4. Check in Postman or your database that the book is really gone.
5. Now try to delete a book that has a **loan** (create one with `POST /loans` first). What happens? Look at the API terminal, the browser console and Sentry.

> Notice `onClick={() => handleDelete(book.id)}` and not `onClick={handleDelete(book.id)}`. The second one runs the function immediately when the page renders, and deletes every book.

**Question:** Explain what `books.filter((book) => book.id !== id)` does, step by step. Why do we make a new array instead of removing the book from the old one?

**Question:** What happened when you deleted a book with a loan, and why? What should the user see on the page in that case?

### Exercise 6: Edit a book with PUT

Your API has `PATCH /books/:id`, but no `PUT`. `PATCH` changes **some** fields. `PUT` replaces **all** fields of the book. An edit form that always sends every field fits `PUT`, so you build it first.

1. In your API, add `PUT /books/:id`. It should:
   - check the id with `idParamSchema` and the body with `bookSchema` (the full schema, not `bookPatchSchema`), and send `400` if one fails
   - find the book with `BookSequelize.findByPk(id)`, and send `404` if it doesn't exist
   - update **all** fields with `book.update(...)`, and send back the updated book with `200`
   - catch errors like your other routes (breadcrumb, `reportError`, `500`)
2. Test it in Postman first: a correct body, a body with a missing field, and an id that doesn't exist.
3. In the client, add an **Edit** button next to every book. When it is clicked, the book turns into a small form with the current values filled in, and a **Save** and a **Cancel** button. You need state to remember which book is being edited:

   ```tsx
   const [editingId, setEditingId] = useState<number | null>(null);
   ```

4. When **Save** is clicked, check the fields with your `bookFormSchema` from Exercise 4, send them with `axios.put(...)`, update the page, and close the form. The same schema works for both forms, because `PUT` needs all fields, just like `POST`. **Cancel** closes the form without saving.
5. Test the whole flow: add a book, edit it, refresh the page, delete it. Take a screenshot of a book in edit mode.

> **Hint:** you can't put `validate(idParamSchema, "params")` and `validate(bookSchema, "body")` on the same route if both save their result in `res.locals.validated`. The second one overwrites the first. Use `safeParse` for both, like your `PATCH` route does.

> **Hint:** like `POST`, your `PUT` probably sends back the book without the author. Either fetch the list again, or include the author in the response.

**Question:** What's the difference between `PUT` and `PATCH`? What happens with `PUT` if the client forgets to send `genre`? And with `PATCH`?

**Question:** Why does the edit form fit `PUT` better than `PATCH`? Can you think of a button on the page where `PATCH` would fit better?

---

## Challenging (optional)

These exercises are optional. Do them if you finished Easy and Medium and want to go further.

### Exercise 7: Clean up your API calls

Right now, `http://localhost:3000` is written in many places, and `App.tsx` is getting long.

1. Create `client/.env` with the API address. Vite only gives your code variables that start with `VITE_`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

2. Add `client/.env.example` with the same name and no value, and check that `client/.env` is ignored by Git.
3. Create `client/src/api/books.ts` with one function per request: `getBooks`, `getBook`, `createBook`, `updateBook` and `deleteBook`. Make `client/src/api/authors.ts` for the authors. Use `import.meta.env.VITE_API_URL` as the base URL, for example with `axios.create({ baseURL: ... })`.
4. Move the `Book` and `Author` types to their own file, and use them in the API functions, for example `axios.get<BooksResponse>(...)`, with a type for `{ page, limit, total, data }`.
5. `axios.get<BooksResponse>` only **tells** TypeScript what comes back. It doesn't check it. Write a Zod schema for the response in `client/src/schemas.ts`, parse the response with it in `getBooks`, and make the type from the schema with `z.infer`:

   ```ts
   export const bookResponseSchema = z.object({
     id: z.number(),
     title: z.string(),
     // ...the other fields, including the author
   });

   export type Book = z.infer<typeof bookResponseSchema>;
   ```

   Test it: rename a field in your API for a moment (for example `title` to `name`). What happens in the client, with and without the Zod check?

6. Split the page into components, for example `BookList`, `BookRow`, `BookForm` and `AuthorList`, and pass data and functions with props.
7. Check that everything still works exactly like before.

> Unlike the API's `.env`, everything in `VITE_` variables ends up in the JavaScript that the browser downloads. Anyone can read it. **Never** put secrets like your `SONAR_TOKEN`, your Sentry auth token or your database password in the client's `.env`.

**Question:** Why is it OK to put the API address in `VITE_API_URL`, but never your database password?

**Question:** Why check data that comes from **your own** API? What's the difference between a TypeScript type and a Zod schema at runtime?

### Exercise 8: Loading, errors and Zod messages

A real page doesn't just show nothing while it waits, or break silently when something goes wrong.

1. Add a `loading` state. Show "Loading…" while the books are being fetched.
2. Add an `error` state. Wrap every request in `try/catch`, and show a friendly message on the page when it fails. Use `axios.isAxiosError(error)` to check the type, and `error.response?.status` to see what went wrong.
3. Your API sends Zod errors with status `400`, as `{ errors: { fieldErrors: { ... } } }`. Show the message for each field **next to that field** in the form. Test it by sending a year as text, or an empty title. Your client's Zod check stops these, so skip `safeParse` in `handleSubmit` for a moment.
4. Handle `404` (a book that was already deleted in another tab) and `500` (stop the database, or delete a book with a loan) with their own messages.
5. While a request is running, disable the buttons, so the user can't click **Save** or **Delete** twice.
6. Take a screenshot of a form with a Zod error next to a field.

**Question:** Your API already validates with Zod. Why should the frontend check the input too? And why is checking only in the frontend never enough?

### Exercise 9: Search, filter and pages

`GET /books` already accepts `search`, `genre`, `sort`, `page` and `limit` in your `bookQuerySchema`. Use them from the page.

1. Add a search field, a genre dropdown (use `GET /stats` to fill it) and a sort dropdown. Send them as query parameters:

   ```ts
   axios.get("http://localhost:3000/books", {
     params: { search, genre, sort, page, limit: 5 },
   });
   ```

2. Add **Previous** and **Next** buttons. Use `total` and `limit` to know when there is no next page.
3. Test it. Does the list really change? Look closely at the `GET /books` route in your API: is the query with `search`, `genre`, `sort` and `page` actually used, or only the count?
4. Fix the route, so the books that are sent back match the filters and the page. Use Sequelize's `where`, `order`, `limit` and `offset` (and `Op.iLike` for the search), and keep the author included.
5. Scan the project with SonarQube again (add `client/src` to `sonar.sources`), and check that the fixed route has no new issues.

**Question:** What was wrong with the `GET /books` route, and why didn't you notice it in Postman before? What does this tell you about testing an API only with tools?

**Question:** Why is it better to filter and paginate in the API (in the database) than to fetch all books and filter them in React?

---

## Additional reading

### Watch and read first

- [React + Vite frontend with an Express backend](https://www.youtube.com/watch?v=VSkWCl5DNLM): this week's video.
- [Vite: Getting started](https://vite.dev/guide/): how to create a project and what `npm run dev` does.

### Read for the exercises

- [Axios: Getting started](https://axios-http.com/docs/intro): `get`, `post`, `put`, `delete`, query `params`, and how to handle errors. Useful for Exercises 2 and 4–9.
- [cors middleware for Express](https://expressjs.com/en/resources/middleware/cors.html): the `origin` option and other settings. Useful for Exercise 2.
- [React: Rendering lists](https://react.dev/learn/rendering-lists): why lists need keys, and why the index is a risky key. Useful for Exercise 3.
- [React: Updating arrays in state](https://react.dev/learn/updating-arrays-in-state): adding, removing and replacing items without changing the old array. Useful for Exercises 4–6.
- [MDN: PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT) and [MDN: PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH): the difference between replacing and changing. Useful for Exercise 6.
- [Zod: Basic usage](https://zod.dev/basics): `safeParse`, error formatting with `z.flattenError`, and `z.infer`. Useful for Exercises 4, 6, 7 and 8.
- [Vite: Env variables](https://vite.dev/guide/env-and-mode): how `VITE_` variables and `import.meta.env` work. Useful for Exercise 7.
- [Sequelize: Model querying basics](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/): `where`, `Op`, `order`, `limit` and `offset`. Useful for Exercise 9.

### Background

- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): what the browser really does when it blocks a request, including "preflight" requests for `PUT` and `DELETE`.
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects): why effects run twice in development.

---

## What to hand in

Push your `week13/frontend` branch with:

- [ ] A `client` folder with a React + TypeScript project made with Vite, and **no** `node_modules` in the repository
- [ ] `cors` set up in your API, allowing `http://localhost:5173`
- [ ] A page that shows the books (with author and year), the total, and data from at least one more `GET` endpoint
- [ ] A form with an author dropdown that adds books with `POST`
- [ ] `client/src/schemas.ts` with a Zod schema that checks the form before it is sent
- [ ] A **Delete** button on every book that uses `DELETE`
- [ ] A new `PUT /books/:id` route in your API, and an **Edit** mode on every book that uses it
- [ ] Optional: `client/.env.example` with `VITE_API_URL=`, an `api` folder, Zod-checked responses and separate components
- [ ] Optional: loading states and error messages, including Zod errors next to the fields
- [ ] Optional: search, filter and pages, and a fixed `GET /books` route
- [ ] `ANSWERS.md` with every **Question:** answered
- [ ] A `screenshots/` folder with the screenshots from Exercises 2, 3, 4 (a Zod error in the form) and 6 (and 8, if you did it)
- [ ] A commit history with small, clear steps

If you get stuck, write down what you tried and where it broke. An honest "I got stuck here" is worth more than a copied solution.
