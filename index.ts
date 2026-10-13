import express, { type Request, type Response } from "express";
import { pool } from "./db.ts";
import "dotenv/config";

const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "Unknown error";
};

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the library. Go to /books to fetch all books");
});

/* 1: -- get one book by id --
      - Return the book as JSON with status 200
      - Return 404 with message: Book not found
      - If id is not a number return status 400 using !Number.isInteger(Number(id))
*/

app.get("/books", async (req: Request, res: Response) => {
  try {
    const { genre, sort } = req.query;
    const allowedSorts = ["title", "published_year", "genre"];

    if (sort && !allowedSorts.includes(sort as string)) {
      return res.status(400).send("The sort is not in the list");
    }

    let sql = "SELECT * FROM books";
    const values = [];

    if (genre) {
      sql += " WHERE genre = $1";
      values.push(genre);
    }

    if (sort) {
      sql += ` ORDER BY ${sort}`;
    }

    const result = await pool.query(sql, values);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

app.get("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).send("id must be a whole number");
  }
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).send("Book not found");
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

/* 2: -- Use the right status code and validate input --
      - POST /books returns 201 Created instead of 200
      - If title is missing from the body, return status 400 with a clear message before any SQL
*/

app.post("/books", async (req: Request, res: Response) => {
  const { title, genre, published_year, author_id } = req.body;
  if (!title) {
    return res.status(400).send("Title is required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO books (title, genre, published_year, author_id) VALUES ($1,$2,$3, $4) RETURNING *",
      [title, genre, published_year, author_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

/* 3: -- Clean up the project structure --
      - Move the pool to its own file, db.ts and import {pool} from "./db.ts" in index.ts
      - Add missing port: process.env.DB_PORT to the pool
      - Read the server port from .env and use it in app.listen
      - Change the "get all" router from / to /books, so all book routes start with /books. Put a welcome message back on /

   4: -- Filter and sort with query parameters --
      - /books?genre=dystopian should filter dystopian books
      - 
      */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
