import "dotenv/config";
import express, { type Request, type Response } from "express";
import { pool } from "./db.ts";

// Helper functions
const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "Unknown error";
};
const isValidId = (id: string): boolean => Number.isInteger(Number(id));

// App setup

const app = express();
const port = process.env.PORT ?? 3000;
app.use(express.json());

// Routes

// Welcome message on the root URL (exercise 3).
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the library. Go to /books to fetch all books");
});

/* 4: -- Filter and sort with query parameters --
      - /books?genre=dystopian → only dystopian books
      - /books?sort=published_year → sorted by year
      - /books?genre=dystopian&sort=title → both together
      - Without any parameters, it returns all books
*/

app.get("/books", async (req: Request, res: Response) => {
  const { genre, sort } = req.query;

  // Column names can't use $1 placeholders, so we only accept columns from this list.
  // This is what protects us from SQL injection in ORDER BY.
  const allowedSorts = ["title", "published_year", "genre"];
  if (sort && !allowedSorts.includes(sort as string)) {
    res.status(400).json({
      error: `Invalid sort. Allowed values: ${allowedSorts.join(", ")}`,
    });
    return;
  }

  try {
    let sql = "SELECT * FROM books";
    // The values that will replace $1, $2, ... in the SQL.
    const values: unknown[] = [];
    if (genre) {
      values.push(genre);
      // values.length gives the right placeholder number ($1, $2, ...),
      // which will make it easy to add more filters later (exercise 8).
      sql += ` WHERE genre = $${values.length}`;
    }
    // Safe to put in the string ONLY because it was checked against allowedSorts.
    if (sort) {
      sql += ` ORDER BY ${sort}`;
    }
    const result = await pool.query(sql, values);
    res.status(200).json(result.rows);
  } catch (err) {
    // Something went wrong on our side (e.g. the database is down).
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

/* 1: -- Get one book by id --
      - 200 with the book, 404 if not found, 400 if id is not a number
*/
app.get("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a whole number" });
    return;
  }

  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

/* 2: -- Use the right status codes and validate input --
      - POST /books returns 201 Created
      - 400 if title is missing, before any SQL runs
*/
app.post("/books", async (req: Request, res: Response) => {
  // "?? {}" means: if there is no body at all, use an empty object so destructuring doesn't crash.
  const { title, genre, published_year, author_id } = req.body ?? {};
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO books (title, genre, published_year, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, genre, published_year, author_id],
    );

    // 201 Created: the correct status when a new row was made.
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

// PUT replaces the WHOLE book: any field you don't send becomes NULL.
// That's why title is required here too.
app.put("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a whole number" });
    return;
  }

  const { title, genre, published_year, author_id } = req.body ?? {};
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE books SET title = $1, genre = $2, published_year = $3, author_id = $4 WHERE id = $5 RETURNING *",
      [title, genre, published_year, author_id, id],
    );

    // No rows updated means no book had that id.
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    // 200 OK (not 201), because we changed an existing row, we didn't create one.
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

/* 5: -- Partial updates with PATCH --
      - Only updates the fields you send
      - 404 if the book doesn't exist, 400 if the body is empty
*/
app.patch("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a whole number" });
    return;
  }

  // Object.keys({}) is [], so length 0 means the body has no fields.
  // !req.body catches requests sent with no body at all.
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Body cannot be empty" });
    return;
  }

  const { title, genre, published_year, author_id } = req.body;

  try {
    // Fields not sent are undefined → pg sends them as NULL.
    // COALESCE($1, title) means "use the new value, or keep the old one if it's NULL".
    // Note: this also means you can't use PATCH to set a field to NULL on purpose.
    const result = await pool.query(
      `UPDATE books
       SET title = COALESCE($1, title),
           genre = COALESCE($2, genre),
           published_year = COALESCE($3, published_year),
           author_id = COALESCE($4, author_id)
       WHERE id = $5
       RETURNING *`,
      [title, genre, published_year, author_id, id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

app.delete("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    res.status(400).json({ error: "id must be a whole number" });
    return;
  }

  try {
    // RETURNING * sends back the deleted book, so the client can see what was removed.
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

// ─────────────────────────────────────────────────────────────
// Start the server
// ─────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
