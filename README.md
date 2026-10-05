# Express + PostgreSQL Homework: Building a CRUD API with a Real Database

### Practice Based on Class Code

In class we connected **Express** to **PostgreSQL** using the `pg` package. We created a connection **pool** with our settings from a `.env` file, made an `athletes` table in pgAdmin, and built a full **CRUD** API:

- `GET` to read all athletes (`SELECT`)
- `POST` to add an athlete (`INSERT ... RETURNING *`)
- `PUT` to update an athlete by id (`UPDATE ... WHERE id = $4`)
- `DELETE` to remove an athlete by id (`DELETE ... WHERE id = $1`)

We used **parameterized queries** (`$1`, `$2`, ...) to safely pass values into SQL, `async`/`await` with `try`/`catch` for errors, and **Insomnia** to test our routes.

Remember the analogy: **PostgreSQL** is the library, **Node.js** is the librarian, and **Express** is the service desk where people come to ask for books. This week you'll build that library for real!

## Goal

Build an Express API that stores its data in PostgreSQL. Practice CRUD routes, parameterized queries, status codes, validation, and finally connect the SQL you learned (joins, `GROUP BY`, relationships) to your backend.

**Videos:**

- Part 1 (Containers, Docker, Postgres & pgAdmin): https://youtu.be/9DIF5Ma--bQ
- Part 2 (Volumes, depends_on & .env): https://www.youtube.com/watch?v=Pvz0CEqnSj0
- Part 3 (Relationships, JOINs, GROUP BY & ORDER BY): https://www.youtube.com/watch?v=7NJmsSNPKi8
- Part 4 (Connecting PostgreSQL to Express): https://www.youtube.com/watch?v=frTlOUg3-Ik

## Project Outline

```
week8-express-postgres/
  ├── compose.yml     : your Postgres + pgAdmin containers
  ├── .env            : your environment variables (NOT on GitHub!)
  ├── .gitignore      : node_modules and .env
  ├── package.json    : with "type": "module"
  ├── init.sql        : all your CREATE TABLE and INSERT statements
  ├── db.js           : your connection pool
  ├── index.js        : your Express server and routes
  └── public/         : (challenge 9) your frontend
      ├── index.html
      └── script.js
```

## Resources

- Extra Reading:
  - **node-postgres** (the `pg` package):
    - Getting started: https://node-postgres.com/
    - Queries and parameters: https://node-postgres.com/features/queries
    - Pooling: https://node-postgres.com/features/pooling
    - Transactions (challenge bonus): https://node-postgres.com/features/transactions
  - **Express** routing and `req.params` / `req.query` / `req.body`: https://expressjs.com/en/guide/routing.html
  - **HTTP status codes** (which one should I send?): https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  - **SQL injection**, and why we use `$1` instead of putting values straight into the SQL string: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
  - **dotenv**: https://www.npmjs.com/package/dotenv
  - **PostgreSQL error codes** (useful for medium 6): https://www.postgresql.org/docs/current/errcodes-appendix.html
- Useful Websites:
  - https://www.w3schools.com/postgresql/
  - https://www.postgresql.org/docs/current/
  - https://hub.docker.com/_/postgres

**Read before you start:** the node-postgres _Queries_ page and the OWASP SQL injection page. They explain _why_ we write our queries the way we do.

### Key Concepts

```bash
npm init -y
npm install express pg dotenv
docker compose up -d
node --watch index.ts       # restarts the server automatically when you save!
```

```js
// db.js: one shared connection pool for the whole app
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
```

```js
// A parameterized query: values go in the array, NEVER straight into the SQL string
const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

result.rows; // an array with all returned rows
result.rows[0]; // the first row (undefined if there are no rows)
result.rowCount; // how many rows were returned or changed
```

```js
// Where does the data come from?
req.params; // /books/:id         → /books/5           → { id: "5" }
req.query; // /books?genre=drama → { genre: "drama" }
req.body; // the JSON you send in Insomnia (needs app.use(express.json()))
```

```
200 OK            → it worked, here is your data
201 Created       → a new row was created (use this for POST!)
400 Bad Request   → the client sent wrong or missing data
404 Not Found     → that id doesn't exist
409 Conflict      → that clashes with existing data (e.g. book already borrowed)
500 Server Error  → something went wrong on our side
```

## Skill 1: Setup

Reuse your Docker setup from week 7, **not** the shorter one from the video. Make sure you have:

- A **Postgres** and a **pgAdmin** service, with **volumes** for both
- `depends_on` on pgAdmin and `restart: unless-stopped` on both
- All usernames, passwords and ports in `.env`

Your Node app and Docker can share **one** `.env` file. Docker Compose reads `.env` automatically, so you can write:

```yaml
environment:
  POSTGRES_USER: ${DB_USER}
  POSTGRES_PASSWORD: ${DB_PASSWORD}
  POSTGRES_DB: ${DB_DATABASE}
```

```bash
# .env
DB_USER=librarian
DB_PASSWORD=password
DB_DATABASE=library
DB_HOST=localhost
DB_PORT=5432
PORT=3000
```

**Why `localhost` in Node, but not in pgAdmin?** Your Node server runs on your laptop, so it reaches Postgres through the port you opened (`localhost:5432`). pgAdmin runs _inside_ Docker, so it reaches Postgres by its service name (e.g. `db`) or by its IP from `docker inspect`.

Then, in pgAdmin, create the `books` table and save the SQL in `init.sql`:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    published_year INT
);

INSERT INTO books (title, genre, published_year)
VALUES
('The Hobbit', 'fantasy', 1937),
('1984', 'dystopian', 1949),
('Pippi Longstocking', 'children', 1945),
('The Hunger Games', 'dystopian', 2008);
```

Finally, rebuild the four CRUD routes from the video, but for `books` instead of `athletes`. Test all four in Insomnia before you continue.

**Tip:** Don't forget `"type": "module"` in `package.json` and `app.use(express.json())` in `index.js`. In the video, both caused errors when they were missing!

## Skill 2: The Assignments

Do the assignments in order; each one builds on the last. For every route you make, create a request for it in **Insomnia** and test both the happy path _and_ the error cases (wrong id, missing data, etc.).

### 🟢 Easy

**1. Get one book by id**

The video's recap mentions fetching data by id, but we never built it! Create `GET /books/:id`.

- Return the book as JSON with status `200`
- Return `404` with a message like `"Book not found"` if the id doesn't exist
- Test it with an id that exists, one that doesn't (e.g. `999`) and something weird like `/books/abc`. What happens? (You'll fix that in exercise 2.)

**2. Use the right status codes and validate input**

- `POST /books` should return `201 Created` instead of `200`
- If `title` is missing from the body, return `400` with a clear message _before_ running any SQL
- If `id` in the URL isn't a number (`/books/abc`), return `400` instead of crashing with a `500`

**Hint:** `Number.isInteger(Number(id))` tells you if `id` is a whole number.

**3. Clean up the project structure**

- Move the pool to its own file, `db.js`, and `import { pool } from "./db.js"` in `index.js`
- Add the missing `port: process.env.DB_PORT` to the pool
- Read the server port from `.env` (`process.env.PORT`) and use it in `app.listen`
- Change the "get all" route from `/` to `/books`, so all book routes start with `/books`. Put a welcome message back on `/`.

### 🟡 Medium

**4. Filter and sort with query parameters**

Make `GET /books` support optional query parameters:

- `/books?genre=dystopian` → only dystopian books
- `/books?sort=published_year` → sorted by year
- `/books?genre=dystopian&sort=title` → both together!
- Without any parameters, it should still return all books

**Watch out:** You can use `$1` for _values_ (like the genre), but **not** for column names in `ORDER BY`. Never put `req.query.sort` straight into your SQL string, since that opens the door to SQL injection! Instead, make a list of allowed columns and check against it:

```js
const allowedSorts = ["title", "published_year", "genre"];
```

If `sort` is not in the list, return `400`.

**5. Partial updates with PATCH**

With our `PUT` route, if you only send `{ "genre": "classic" }`, the title and year become `NULL`! Create `PATCH /books/:id` that only updates the fields you actually send.

- Sending `{ "genre": "classic" }` changes only the genre
- Return the updated book, or `404` if it doesn't exist
- Return `400` if the body is empty

**Hint:** Look up `COALESCE` in PostgreSQL. `SET title = COALESCE($1, title)` means "use the new value, or keep the old one if the new value is `NULL`."

**6. Add authors (one-to-many)**

Just like in the relationships video, one author can write many books, but each book has one author.

- Create an `authors` table (`id`, `name`) and add an `author_id` column to `books` that is a **foreign key** to `authors(id)`. (Look up `ALTER TABLE ... ADD COLUMN`.) Add the SQL to `init.sql`.
- Create `GET /authors`, `POST /authors` and `GET /authors/:id/books`, which returns all books by that author using a `JOIN`
- Allow `author_id` in `POST /books`
- If someone creates a book with an `author_id` that doesn't exist, Postgres throws an error with `err.code === "23503"` (foreign key violation). Catch it and return `400` with a helpful message instead of a `500`.

### 🔴 Challenging

**7. Borrowing books (many-to-many)**

Members can borrow many books, and a book can be borrowed by many members over time. That's a many-to-many relationship, so you need a **junction table**.

- Create a `members` table (`id`, `name`, `email UNIQUE`)
- Create a `loans` table: `id`, `book_id` (FK), `member_id` (FK), `borrowed_at TIMESTAMP DEFAULT NOW()`, and `returned_at TIMESTAMP` (empty until the book comes back)
- `POST /members` creates a member. If the email already exists, catch `err.code === "23505"` (unique violation) and return `409`.
- `POST /loans` with `{ "book_id": 1, "member_id": 2 }` lets a member borrow a book. If that book is already borrowed (a loan with `returned_at IS NULL` exists), return `409 Conflict`.
- `PATCH /loans/:id/return` sets `returned_at` to `NOW()`
- `GET /members/:id/loans` returns the member's loans **with the book titles**, joining three tables, just like students → student_courses → courses in the relationships video

**8. Search, pagination and statistics**

Real APIs don't send back 10,000 rows at once.

- `GET /books?search=hun` finds books whose title contains the text, ignoring upper/lower case (look up `ILIKE`)
- `GET /books?page=2&limit=2` returns only that page (look up `LIMIT` and `OFFSET`). Default to page 1 with 10 books.
- Change the response so it also tells the client how many results there are in total:

```json
{
  "page": 2,
  "limit": 2,
  "total": 4,
  "data": [ ... ]
}
```

- Create `GET /stats` that returns the number of books per genre, using `COUNT(*)` and `GROUP BY`. Bonus: also return the author with the most books.
- Make sure search, filter (from exercise 4) and pagination all work together!

**9. Connect a frontend**

Time to put a real website on your API!

- Add `app.use(express.static("public"))` and create `public/index.html` and `public/script.js`
- Use `fetch` to show all books on the page, with a form to add a new book and a delete button next to each book
- Show the error message from your API when something goes wrong (e.g. adding a book without a title)
- **Bonus:** Make Docker create your tables automatically. Mount your `init.sql` into the Postgres container at `/docker-entrypoint-initdb.d/init.sql`. Note: this only runs when the database volume is **empty**, so you'll need `docker compose down -v` to test it. That **deletes your data!**

**Extra bonus (transactions):** Borrowing a book in exercise 7 is really two steps: checking that the book is available, and creating the loan. What happens if two members borrow the same book at exactly the same time? Read the node-postgres page on transactions and try to make `POST /loans` safe with `BEGIN`, `COMMIT` and `ROLLBACK`.

**Try it yourself first!** Use the extra reading and the class code. If you're stuck for more than 20 minutes, `console.log` everything (`req.body`, `req.params`, `result.rows`, `err.message`), and remember that most bugs in the video were a missing `await`, a typo in `.env` or a server that needed a restart.

## When You Finish

Make sure:

- `init.sql` runs from top to bottom in pgAdmin without errors on an empty database
- Every route works in Insomnia, including the error cases
- `.env` and `node_modules` are in `.gitignore`

Push your project to your GitHub repository on the following branch: `week8/express-postgres`

Your submission should include `compose.yml`, `package.json`, `init.sql`, `db.js`, `index.js` and (if you did exercise 9) the `public` folder. In your pull request, write which exercises you completed.

Good luck! Last week your data lived in pgAdmin; this week your own server is the librarian. 📚
