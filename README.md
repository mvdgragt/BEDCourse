username: admin
password: pass

# MongoDB & Mongoose Homework: The Library, the NoSQL Way

### Practice Based on Class Code

For the last few weeks our library lived in **PostgreSQL**: strict tables, columns and types, like a neatly organized filing cabinet. This week we rebuilt a similar app on **MongoDB**, the flexible "scrapbook" where data is stored as documents. We used:

- **Docker** to run **MongoDB** and **mongo-express** (the web UI, like pgAdmin was for Postgres)
- **Mongoose** to connect from Node, define a **Schema** and a **Model**, and do CRUD
- `Model.find()`, `new Model(req.body).save()`, `findByIdAndUpdate()` and `findByIdAndDelete()` for the four routes
- `try`/`catch` on every route and `.then()`/`.catch()` on the connection

The big idea from the video: **SQL is a filing cabinet** (structured, strict), **NoSQL is a scrapbook** (flexible, schema-light). This week you'll feel that difference by building the _same_ library you already built in SQL.

## Goal

Rebuild your library API on MongoDB with Mongoose, then use Mongoose features (validation, queries, references, aggregation) to match what you did in SQL, and reflect on when you'd choose each.

**Videos:**

- Part 7 (MongoDB, Mongoose & mongo-express): https://www.youtube.com/watch?v=hhsKANNQBDg
- (For comparison) Part 4 (PostgreSQL + Express): https://www.youtube.com/watch?v=frTlOUg3-Ik

## Project Outline

```
week9-mongodb/
  ├── compose.yml     : your MongoDB + mongo-express containers
  ├── .env            : your environment variables (NOT on GitHub!)
  ├── .env.example    : the same keys with fake values
  ├── .gitignore      : node_modules and .env
  ├── package.json    : with "type": "module"
  ├── index.js        : your Express server
  ├── db.js           : your Mongoose connection
  ├── models/         : one file per model (Book.js, Author.js, Member.js, Loan.js)
  └── COMPARISON.md   : challenge 9 — your SQL vs NoSQL write-up
```

## Resources

- Extra Reading:
  - **Mongoose**:
    - Getting started: https://mongoosejs.com/docs/index.html
    - Schemas and types: https://mongoosejs.com/docs/guide.html
    - Built-in validation (`required`, `min`, `enum`, `default`): https://mongoosejs.com/docs/validation.html
    - Queries (filter, `.sort()`, `.limit()`, `.skip()`): https://mongoosejs.com/docs/queries.html
    - References and `.populate()`: https://mongoosejs.com/docs/populate.html
    - Aggregation (challenge 8): https://mongoosejs.com/docs/api/aggregate.html
  - **MongoDB**:
    - CRUD operations: https://www.mongodb.com/docs/manual/crud/
    - Data modelling: embedding vs referencing: https://www.mongodb.com/docs/manual/data-modeling/
    - SQL to MongoDB mapping chart (very useful!): https://www.mongodb.com/docs/manual/reference/sql-comparison/
  - **Docker images**:
    - MongoDB: https://hub.docker.com/_/mongo
    - mongo-express: https://hub.docker.com/_/mongo-express

**Read before you start:** the Mongoose _Getting started_ page and the MongoDB _SQL to MongoDB mapping chart_. The chart shows how every SQL idea you know translates to MongoDB.

### Key Concepts

```js
// A schema is like a loose CREATE TABLE: it describes a document's shape
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  publishedYear: Number,
});

const Book = mongoose.model("Book", bookSchema); // "Book" → the "books" collection

// CRUD with Mongoose
await Book.find(); // SELECT * FROM books
await Book.findById(id); // ... WHERE id = ...
await new Book(req.body).save(); // INSERT
await Book.findByIdAndUpdate(id, data, { new: true }); // UPDATE (new: return updated doc)
await Book.findByIdAndDelete(id); // DELETE
```

```js
// Queries with filters, sorting and paging
await Book.find({ genre: "fantasy" }) // WHERE genre = 'fantasy'
  .sort({ publishedYear: -1 }) // ORDER BY published_year DESC
  .limit(10) // LIMIT 10
  .skip(20); // OFFSET 20
```

```bash
docker compose up -d
node --watch index.js
```

**Reminders from the video:** the mongo-express service uses the `mongo-express` image (not `express`); `ME_CONFIG_MONGODB_SERVER` must match your MongoDB container name; mongo-express is on `localhost:8081`; declare your named volume at the top level; and don't add `useNewUrlParser`/`useUnifiedTopology` (they do nothing now).

## Skill 1: Setup

Create a `compose.yml` with two services:

- **MongoDB** (`mongo` image), container named `mongodb`, port `27017:27017`, and a **named volume** mounted at `/data/db` so your data survives a restart
- **mongo-express** (`mongo-express` image), port `8081:8081`, with `ME_CONFIG_MONGODB_SERVER` set to `mongodb`

Put credentials and the connection string in `.env` (and make an `.env.example`). Then:

- `npm init -y`, add `"type": "module"` to `package.json`
- `npm install express mongoose`, and `npm install -D dotenv` if you want it (or just `dotenv`)
- Connect in `db.js` using `process.env.MONGO_URI`, with `.then()`/`.catch()` logging
- Run `docker compose up -d` and open `http://localhost:8081`. mongo-express will ask you to log in:

  ```
  username: admin
  password: pass
  ```

  Then check your database appears once you insert something.

**Tip:** Your connection string looks like `mongodb://localhost:27017/library`. The database is created automatically the first time you write to it.

## Skill 2: The Assignments

Do them in order; each builds on the last. Test every route in **Insomnia**, both the success case and the error cases.

### 🟢 Easy — the video, as a library

**1. Book model + read and create**

- Make `models/Book.js` with `title` (String), `genre` (String) and `publishedYear` (Number)
- Build `GET /books` (all books) and `POST /books` (add one), just like the video's items
- Wrap both in `try`/`catch` and return a `500` with a JSON error message if something fails

**2. Finish the CRUD**

- Add `GET /books/:id`, `PUT /books/:id` and `DELETE /books/:id`
- Use `findById`, `findByIdAndUpdate(id, data, { new: true })` and `findByIdAndDelete`
- If the id doesn't exist, return `404` with `{ "error": "Book not found" }` (not a `500`)

**3. Clean up: `.env` and structure**

- Move the connection string to `.env` and read it with `process.env.MONGO_URI`
- Put the Mongoose connection in `db.js` and import it in `index.js`
- Add `.env` and `node_modules` to `.gitignore`, and commit an `.env.example`
- Add `.then()`/`.catch()` on the connection so a failed DB connection prints a clear message

### 🟡 Medium — Mongoose does more than Postgres gave you for free

**4. Schema validation (the scrapbook gets some rules)**

NoSQL is flexible, but Mongoose lets you add just the rules you want:

- `title`: `required`, with a custom message
- `genre`: an `enum` of allowed values (e.g. fantasy, dystopian, children, classic)
- `publishedYear`: a Number with a sensible `min`/`max`
- Add `timestamps: true` to the schema so every book gets `createdAt`/`updatedAt` automatically
- A failed validation throws; catch it and return `400` with the message, not `500`

**Compare:** In Postgres these were `NOT NULL`, `CHECK` and a `CASE`/whitelist. Which felt easier here?

**5. Filter, sort and paginate with query params**

Make `GET /books` understand:

- `/books?genre=fantasy` → only that genre (`Book.find({ genre })`)
- `/books?sort=publishedYear` → sorted (`.sort()`)
- `/books?page=2&limit=5` → `.limit()` and `.skip()`, defaulting to page 1
- Return `{ page, limit, total, data }`, using `Book.countDocuments(filter)` for the total

**6. Authors as references (one-to-many)**

In SQL this was a foreign key. In Mongo you store an id and `populate` it:

- Make `models/Author.js` (`name`)
- Add `author` to the book schema: `{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }`
- `POST /authors`, `GET /authors`
- Make `GET /books` use `.populate("author")` so each book shows the author's details, not just an id
- `GET /authors/:id/books` returns that author's books

**Compare:** this is the relationships video's one-to-many, but with `populate()` instead of `JOIN`.

### 🔴 Challenging — optional

**7. Borrowing books (many-to-many with references)**

- Make `models/Member.js` (`name`, `email` with `unique: true`) and `models/Loan.js` with `book` and `member` as `ObjectId` refs, plus `borrowedAt` (default now) and `returnedAt` (optional)
- `POST /loans` lets a member borrow a book. Reject with `409` if that book already has a loan where `returnedAt` is missing.
- `PATCH /loans/:id/return` sets `returnedAt` to now
- `GET /members/:id/loans` uses `.populate("book")` so you see titles, not ids

**Think about it:** MongoDB won't stop you saving a `book` id that doesn't exist (no foreign keys!). Whose job is that now? (Hint: check it in your route before saving.)

**8. Statistics with the aggregation pipeline**

- `GET /stats/genres` returns the number of books per genre using an aggregation `$group` with `$sum`
- `GET /stats/top-authors` returns authors sorted by how many books they have (`$group` then `$sort`)

**Compare:** this is `COUNT(*) ... GROUP BY` from the SQL weeks. Look up the aggregation pipeline and try `$group`, `$sort` and `$limit`.

**9. Embedding vs referencing, and a verdict**

- Make a **second** version of loans that **embeds** recent loans as an array inside the member document instead of using a separate collection. Try one query that's easier this way and one that's harder.
- Write `COMPARISON.md` (about half a page): using _your own_ Postgres library and this Mongo one, compare them on schema/validation, relationships (`JOIN` vs `populate`), and how each handled a change like "add a new field to books." End with: for a library system, which would you pick, and why?
- **Bonus:** point a small frontend (or your Postgres frontend from before) at this API and confirm it works the same from the outside, whatever the database underneath.

**Try it yourself first!** Use the Mongoose docs and the SQL-to-MongoDB chart. If something's off, `console.log` your `req.body`, the saved document and `err.message`, and remember the video's own lesson: half the bugs were fixed by restarting the server.

## When You Finish

Make sure:

- Every route works in Insomnia, including the error cases
- Bad data gives a `400` and a missing id gives a `404` (never a `500`)
- `.env` is in `.gitignore`, `.env.example` is committed

Push your project to your GitHub repository on the following branch: `week9/mongodb`

Your submission should include `compose.yml`, `package.json`, `index.js`, `db.js`, the `models` folder, and (if you did challenge 9) `COMPARISON.md`. In your pull request, list which exercises you completed.

Good luck! Same library, different shelving system. By the end you'll have built it both ways, which is the best way to understand why both exist. 📚
