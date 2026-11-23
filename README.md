# Week 12 – A React Frontend for Your Express API

**Video:** [React + Vite frontend with an Express backend](https://www.youtube.com/watch?v=VSkWCl5DNLM)

Until now, you have tested your API with Postman, Insomnia or the browser. Real users never do that. They click buttons on a web page, and the page talks to the API for them.

This week you build that page. You create a **React** frontend with **Vite**, next to the Express API you have worked on for weeks (the one with Prisma, Winston, Sentry and SonarQube). The frontend uses **Axios** to send requests to your API, and **CORS** to make sure the API allows those requests.

You start with the easy part: **reading** data and showing it on the page (`GET`). Then you make the page **change** data: create (`POST`), update (`PUT`) and delete (`DELETE`).

---

## Learning goals

After this assignment you can:

- Create a React + TypeScript project with Vite
- Explain what CORS is, and why the browser blocks requests between different ports
- Fetch data from your own API with Axios, `useEffect` and `useState`
- Show a list on the page with `.map()`, and explain why every item needs a `key`
- Send `POST`, `PUT` and `DELETE` requests from a form or a button
- Keep the page in sync with the database after a change

---

## Before you start

1. Check out your `week11/sonarqube` branch, and make sure it is up to date.
2. Create a new branch from it: `week12/frontend`. You continue working on the same project, so your API, database and SonarQube setup come with you.
3. Start your API and check that your endpoints still work in Postman or Insomnia. Write down which endpoints you have, which port the API runs on, and what one object looks like (for example an item with `id` and `name`).
4. Your frontend goes in a **new folder** called `client`, in the root of your project. Your API code stays where it is.

> In the video, the API runs on port `8080` and the endpoint is `/api`. Your API probably uses another port (for example `3000`) and other endpoints (for example `/items`). Use **your own** port and endpoints everywhere in this assignment. The examples below use `/items` and an item with a `name`. Change them to fit your project.

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

### Exercise 2: Fetch data and fix CORS

1. In the **client** folder, install Axios:

   ```bash
   npm install axios
   ```

2. In `App.tsx`, write a function that gets the data from one of your `GET` endpoints, and call it in a `useEffect` with an empty dependency array:

   ```tsx
   import { useEffect } from "react";
   import axios from "axios";

   function App() {
     const fetchItems = async () => {
       const response = await axios.get("http://localhost:3000/items");
       console.log(response);
     };

     useEffect(() => {
       fetchItems();
     }, []);

     return <h1>My items</h1>;
   }

   export default App;
   ```

3. Open the browser console. You get a **CORS error**. Take a screenshot of it.
4. In the **API** folder, install `cors` (and its types, because your API uses TypeScript):

   ```bash
   npm install cors
   npm install --save-dev @types/cors
   ```

5. In your API's main file, allow requests from the client. Put this **before** your routes:

   ```ts
   import cors from "cors";

   app.use(cors({ origin: "http://localhost:5173" }));
   ```

6. Refresh the client. The CORS error is gone, and you see the response object in the console.
7. Explore the object in the console. Find `response.data`. Log only the part you need.

> In the video, the data is logged twice, and the teacher says React is "testing first". What really happens: in development, React's `StrictMode` (in `main.tsx`) runs every effect twice on purpose, to help you find bugs. It doesn't happen in production.

**Question:** In your own words: what is CORS, and why did the browser block the request? Why did the same request work fine in Postman?

**Question:** Why do we write `origin: "http://localhost:5173"` instead of allowing every origin? What would you have to change when the frontend is put online?

### Exercise 3: Show the data on the page

1. Make a type for one object from your API, so TypeScript knows what you get back:

   ```ts
   type Item = {
     id: number;
     name: string;
   };
   ```

2. Store the data in state. Give `useState` the type, otherwise TypeScript thinks the array is always empty (`never[]`):

   ```tsx
   const [items, setItems] = useState<Item[]>([]);
   ```

3. In `fetchItems`, call `setItems(response.data)` instead of `console.log`.
4. Show the list with `.map()`:

   ```tsx
   <ul>
     {items.map((item) => (
       <li key={item.id}>{item.name}</li>
     ))}
   </ul>
   ```

5. Show the data from at least **two** different `GET` endpoints on the page. For example: a list of all items, and the details of one item (`GET /items/:id`).
6. Add a new row in your database (with Postman or Prisma Studio), refresh the client, and check that it shows up.
7. Take a screenshot of the page.

> In the video, the `key` is put on the `<ul>`, and the index from `.map()` is used as key. The `key` belongs on the element **inside** the map (here the `<li>`), and the `id` from the database is a better key than the index. You don't always need the index in `.map()`.

**Question:** Why does React need a `key` on every item in a list? Why is the database `id` a better key than the index, especially once you can delete items?

**Question:** Explain in your own words what `useState` and `useEffect` do in this component. What would happen if you removed the empty array `[]` from `useEffect`?

---

## Medium

### Exercise 4: Create with POST

1. Check that your API has a `POST` endpoint (for example `POST /items`) and that it uses `app.use(express.json())`. Without it, `req.body` is `undefined`.
2. Add a form to the page with an input field and a button. Store what the user types in state:

   ```tsx
   const [name, setName] = useState("");
   ```

3. When the form is submitted, send the new item to the API:

   ```tsx
   const handleSubmit = async (event: React.FormEvent) => {
     event.preventDefault();
     const response = await axios.post("http://localhost:3000/items", { name });
     setItems([...items, response.data]);
     setName("");
   };
   ```

4. Check that the new item shows up on the page **without** refreshing, and that it is still there after you refresh (so it was really saved in the database).
5. Don't send empty items: disable the button, or stop in `handleSubmit`, when the input is empty.

> **Hint:** if the new item shows up with no name, look at what your API returns from `POST`. The code above expects the API to send back the created item. If yours doesn't, change the API, or call `fetchItems()` again after posting.

**Question:** What does `event.preventDefault()` do? Remove it and test. What happens, and why?

**Question:** After posting, you can either add `response.data` to the state, or fetch the whole list again. What are the pros and cons of each way?

### Exercise 5: Delete with DELETE

1. Check that your API has a `DELETE` endpoint (for example `DELETE /items/:id`).
2. Add a **Delete** button next to every item in the list.
3. When it is clicked, send the request, and remove the item from the state:

   ```tsx
   const handleDelete = async (id: number) => {
     await axios.delete(`http://localhost:3000/items/${id}`);
     setItems(items.filter((item) => item.id !== id));
   };
   ```

   ```tsx
   <button onClick={() => handleDelete(item.id)}>Delete</button>
   ```

4. Ask the user before deleting, for example with `window.confirm("Are you sure?")`.
5. Check in Prisma Studio or Postman that the row is really gone from the database.

> Notice `onClick={() => handleDelete(item.id)}` and not `onClick={handleDelete(item.id)}`. The second one runs the function immediately when the page renders, and deletes everything.

**Question:** Explain what `items.filter((item) => item.id !== id)` does, step by step. Why do we make a new array instead of removing the item from the old one?

**Question:** What should happen on the page if the `DELETE` request fails, for example because the API is down? What does your code do right now?

### Exercise 6: Update with PUT

1. Check that your API has a `PUT` endpoint (for example `PUT /items/:id`).
2. Add an **Edit** button next to every item. When it is clicked, the item's name turns into an input field with a **Save** and a **Cancel** button. You need state to remember which item is being edited:

   ```tsx
   const [editingId, setEditingId] = useState<number | null>(null);
   const [editName, setEditName] = useState("");
   ```

3. When **Save** is clicked, send the new value to the API, and replace the old item in the state:

   ```tsx
   const handleSave = async (id: number) => {
     const response = await axios.put(`http://localhost:3000/items/${id}`, {
       name: editName,
     });
     setItems(items.map((item) => (item.id === id ? response.data : item)));
     setEditingId(null);
   };
   ```

4. **Cancel** closes the input without saving.
5. Test the whole flow: create an item, edit it, refresh the page, delete it. Take a screenshot of an item in edit mode.

**Question:** What's the difference between `PUT` and `PATCH`? Which one fits your endpoint best, and why?

**Question:** Why does `handleSave` use `.map()` here, while `handleDelete` uses `.filter()`?

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
3. Create `client/src/api/items.ts` with one function per request: `getItems`, `getItem`, `createItem`, `updateItem` and `deleteItem`. Use `import.meta.env.VITE_API_URL` as the base URL, for example with `axios.create({ baseURL: ... })`.
4. Move the `Item` type to its own file, and use it in the API functions, for example `axios.get<Item[]>(...)`.
5. Split the page into components, for example `ItemList`, `ItemRow` and `ItemForm`, and pass data and functions with props.
6. Check that everything still works exactly like before.

> Unlike the API's `.env`, everything in `VITE_` variables ends up in the JavaScript that the browser downloads. Anyone can read it. **Never** put secrets like tokens or passwords in the client's `.env`.

**Question:** Why is it OK to put the API address in `VITE_API_URL`, but never a secret like your `SONAR_TOKEN` or database password?

### Exercise 8: Loading and errors

A real page doesn't just show nothing while it waits, or break silently when something goes wrong.

1. Add a `loading` state. Show "Loading…" while the first `GET` is running.
2. Add an `error` state. Wrap every request in `try/catch`, and show a friendly message on the page when it fails.
3. Test it: stop your API and refresh the client. Then start the API, and try to create an item with an empty name (if your API validates input), or delete an id that doesn't exist.
4. If your API sends back an error message (for example with status `400` or `404`), show **that** message on the page. With Axios, you find it in `error.response?.data`. Use `axios.isAxiosError(error)` to check the type.
5. While a request is running, disable the buttons, so the user can't click **Save** or **Delete** twice.
6. Take a screenshot of an error message on the page.

**Question:** Your API already validates input. Why should the frontend check the input too? And why is checking only in the frontend never enough?

### Exercise 9: Scan the frontend with SonarQube

Last week you scanned your API. Now your project has a frontend too, and it deserves the same review.

1. Start SonarQube with `docker compose up`.
2. Add the client to what SonarQube scans, in `sonar-project.properties`. Change the folder names to fit your project:

   ```properties
   sonar.sources=src,client/src
   sonar.exclusions=**/node_modules/**,dist/**,client/dist/**,coverage/**
   ```

3. Run `npm run sonar` from the root of your project and open the dashboard.
4. Find at least **three** issues in the client code. Write a triage table in `ANSWERS.md`, like last week:

   | Rule | File and line | Severity | Fix or not? | Why |
   | ---- | ------------- | -------- | ----------- | --- |

5. Fix at least two of them, and scan again. Take a screenshot of the dashboard before and after.

> **Hint:** SonarQube knows many React rules, for example about keys in lists, unused state, and hooks used in the wrong place. If you used the index as key somewhere, it will probably tell you.

**Question:** Did SonarQube find anything in your React code that you would not have noticed yourself? Did it miss anything that you know is a problem, like missing error handling?

---

## Additional reading

### Watch and read first

- [React + Vite frontend with an Express backend](https://www.youtube.com/watch?v=VSkWCl5DNLM): this week's video.
- [Vite: Getting started](https://vite.dev/guide/): how to create a project and what `npm run dev` does.

### Read for the exercises

- [Axios: Getting started](https://axios-http.com/docs/intro): `get`, `post`, `put`, `delete`, and how to handle errors. Useful for Exercises 2 and 4–8.
- [cors middleware for Express](https://expressjs.com/en/resources/middleware/cors.html): the `origin` option and other settings. Useful for Exercise 2.
- [React: Rendering lists](https://react.dev/learn/rendering-lists): why lists need keys, and why the index is a risky key. Useful for Exercise 3.
- [React: Updating arrays in state](https://react.dev/learn/updating-arrays-in-state): adding, removing and replacing items without changing the old array. Useful for Exercises 4–6.
- [Vite: Env variables](https://vite.dev/guide/env-and-mode): how `VITE_` variables and `import.meta.env` work. Useful for Exercise 7.

### Background

- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): what the browser really does when it blocks a request, including "preflight" requests for `PUT` and `DELETE`.
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects): why effects run twice in development.

---

## What to hand in

Push your `week12/frontend` branch with:

- [ ] A `client` folder with a React + TypeScript project made with Vite, and **no** `node_modules` in the repository
- [ ] `cors` set up in your API, allowing `http://localhost:5173`
- [ ] A page that shows data from at least two `GET` endpoints
- [ ] A form that creates new items with `POST`
- [ ] A **Delete** button on every item that uses `DELETE`
- [ ] An **Edit** mode on every item that saves with `PUT`
- [ ] Optional: `client/.env.example` with `VITE_API_URL=`, an `api` folder and separate components
- [ ] Optional: loading and error messages on the page
- [ ] Optional: `sonar-project.properties` that also scans `client/src`
- [ ] `ANSWERS.md` with every **Question:** answered (and the triage table, if you did Exercise 9)
- [ ] A `screenshots/` folder with the screenshots from Exercises 2, 3 and 6 (and 8 and 9, if you did them)
- [ ] A commit history with small, clear steps

If you get stuck, write down what you tried and where it broke. An honest "I got stuck here" is worth more than a copied solution.
