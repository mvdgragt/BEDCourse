import express from "express";
import { z } from "zod";
const app = express();
const PORT = 3000;
app.use(express.json());

// Define a schema for a "username"

const user = { name: "Michiel12", age: 47 };

const userSchema = z.object({
  name: z.string().min(3).max(10),
  age: z
    .number()
    .min(18, { message: "You must be at least 18 years old" })
    .max(100, { message: "You can not be older than 99!" })
    .optional()
    .default(28),
  email: z.email(),
});

const restaurantSchema = z.object({
  name: z.string(),
  menu: z.object({
    appetizers: z.array(z.string()),
    mains: z.array(z.string()).min(1, "At least one main dish is reuqired"),
  }),
  openinghourse: z.record(z.string(), z.array(z.string())), //{mon: ["kl9", "kl10"]}
});

const emailSchema = z.object({
  email: z.email().toLowerCase(),
  //Michiel.vanderGargt@sundsgarden.se
  //michiel.vandergragt@sundsgarden.se
});

const randomUserResponseSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      email: z.email(),
    }),
  ),
});

app.get("/random-user", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api");
    const data = await response.json();
    const validatedRandomUser = randomUserResponseSchema.safeParse(data);

    if (!validatedRandomUser.success) {
      return res.status(500).json({
        error: "Invalid data from RandomUser API",
        details: validatedRandomUser.error,
      });
    }
    const randomUser = validatedRandomUser.data.results[0];
    res.json({
      name: `${randomUser?.name.first} ${randomUser?.name.last}`,
      email: `${randomUser?.email}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch random user",
    });
  }
});

const validatedUsername = userSchema.safeParse(user);

if (!validatedUsername.success) {
  console.error(validatedUsername.error);
} else {
  console.log(validatedUsername.data);
}

app.post("/user", (req, res) => {
  const newUser = userSchema.safeParse(req.body);
  res.status(201).json({ user: newUser });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
