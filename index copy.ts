import express, { type Request, type Response } from "express";
import { pool } from "./db.ts";

const app = express();
// ---------- Helpers ----------
const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "Unknown error";
};

app.use(express.json());

// GET

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library");
});

const allowedSorts = ["title", "published_year", "genre", "author_id"];

// GET all books ( + optional query params)

app.get("/books", async (req: Request, res: Response) => {
  const { genre, sort } = req.query;

  if (
    sort !== undefined &&
    (typeof sort !== "string" || !allowedSorts.includes(sort))
  ) {
    return res.status(400).send(" Invalid sort column");
  }
  const orderBy = sort || "id";

  try {
    let result;

    if (typeof genre === "string") {
      result = await pool.query(
        `SELECT * 
                FROM books 
                WHERE genre = $1 
                ORDER BY ${orderBy}`,
        [genre],
      );
    } else {
      result = await pool.query(
        `SELECT * 
                FROM books 
                ORDER BY ${orderBy}`,
      );
    }
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// GET book by id

app.get("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

//POST new book

interface NewBook {
  title: string;
  genre?: string;
  published_year?: number;
  author_id?: number;
}

app.post("/books", async (req: Request, res: Response) => {
  const { title, genre, published_year, author_id } = req.body;

  if (!title) {
    return res.status(400).send("Title is required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO books (title, genre, published_year,author_id) VALUES ($1, $2, $3, $4) RETURNING * ",
      [title, genre, published_year, author_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23503") {
      return res.status(400).send("Author does not exist");
    }
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// PUT UPDATE

interface UpdateBook {
  title: string;
  genre: string;
  published_year: number;
}

app.put(
  "/books/:id",
  async (req: Request<{ id: string }, {}, UpdateBook>, res: Response) => {
    const { id } = req.params;
    const { title, genre, published_year } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).send("ID must be a number");
    }

    if (!title) {
      return res.status(400).send("Title is required");
    }

    try {
      const result = await pool.query(
        `UPDATE books 
            SET title = $1, 
            genre = $2, 
            published_year = $3 
            WHERE id = $4 
            RETURNING * `,
        [title, genre, published_year, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).send("Book not found");
      }

      res.json(result.rows[0]);
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : "Unknown error");
    }
  },
);

// PARTIAL UPDATE

app.patch("/books/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { title, published_year, genre } = req.body;

  if (!Number.isInteger(Number(id))) {
    return res.status(400).send("ID must be a number");
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send("Request body cannot be empty");
  }

  try {
    const result = await pool.query(
      `UPDATE books SET title = COALESCE($1, title), 
            published_year = COALESCE($2, published_year),
            genre = COALESCE($3, genre) 
            WHERE id = $4
            RETURNING *`,
      [title, published_year, genre, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// DELETE a book

app.delete(
  "/books/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).send("ID must be a number");
    }

    try {
      const result = await pool.query(
        `DELETE FROM books 
            WHERE id = $1 
            RETURNING *`,
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).send("Book not found");
      }

      res.send("Book deleted successfully");
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : "Unknown error");
    }
  },
);

// GET AUTHORS

app.get("/authors", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM authors`);

    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

// GET all books by author (JOIN)

app.get(
  "/authors/:id/books",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).send("ID must be a number");
    }

    try {
      const result = await pool.query(
        `SELECT books.*
             FROM books
             JOIN authors
             ON books.author_id = authors.id
             WHERE authors.id = $1`,
        [id],
      );

      res.json(result.rows);
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : "Unknown error");
    }
  },
);

// ADD new author

interface NewAuthor {
  name: string;
}

app.post("/authors", async (req: Request<{}, {}, NewAuthor>, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required");
  }

  try {
    const result = await pool.query(
      `INSERT INTO authors (name) 
            VALUES ($1)
            RETURNING *`,
      [name],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
