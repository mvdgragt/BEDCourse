import express from "express";
import type { Request, Response } from "express";
import pg from "pg";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const PORT = 3000;
const app = express();
const { Pool } = pg;

// ---------- Environment variables ----------
const envSchema = z.object({
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().default(5432),
});

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(validatedEnv.error),
  );
  process.exit(1);
}

const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } =
  validatedEnv.data;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

// ---------- Validation schema ----------
const athleteSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Your name needs to include at least 2 characters" })
    .max(20, { message: "Your name needs to include at most 20 characters" }),
  sport: z.string().min(2).max(20),
  age: z.number().min(8).max(50),
});

type Athlete = z.infer<typeof athleteSchema> & { id: number };

// ---------- Helpers ----------
function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

app.use(express.json());

// ---------- Routes ----------
app.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query<Athlete>("SELECT * FROM athletes");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

app.post("/athletes", async (req: Request, res: Response) => {
  const validatedAthlete = athleteSchema.safeParse(req.body);
  if (!validatedAthlete.success) {
    return res.status(400).json({ errors: validatedAthlete.error });
  }
  const { name, sport, age } = validatedAthlete.data;
  try {
    const result = await pool.query<Athlete>(
      "INSERT INTO athletes (name, sport, age) VALUES ($1, $2, $3) RETURNING *",
      [name, sport, age],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

app.put("/athletes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedAthlete = athleteSchema.safeParse(req.body);
  if (!validatedAthlete.success) {
    return res.status(400).json({ errors: validatedAthlete.error });
  }
  const { name, sport, age } = validatedAthlete.data;
  try {
    const result = await pool.query<Athlete>(
      "UPDATE athletes SET name = $1, sport = $2, age = $3 WHERE id = $4 RETURNING *",
      [name, sport, age, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Athlete not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

app.delete("/athletes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Athlete>(
      "DELETE FROM athletes WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Athlete not found");
    }
    res.send("Athlete deleted successfully");
  } catch (err) {
    res.status(500).send(getErrorMessage(err));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
