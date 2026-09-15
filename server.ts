import express, { Request, Response } from "express";

const app = express();

const PORT = 3000;

type Menu = {
  restaurant: string;
  categories: {
    appetizers: string[];
    mains: string[];
    desserts: string[];
    drinks: string[];
  };
  lastUpdated: string;
};

type About = {
  title: string;
  description: string;
  funFacts?: string[];
  funFact?: string;
  lastUpdated?: string;
};

// app.get("/", (req: Request, res: Response): void => {
//   res.send("Welcome to our restaurant");
// });

// app.get("/menu", (req: Request, res: Response): void => {
//   const menu: Menu = {
//     restaurant: "My First Restaurant",
//     categories: {
//       appetizers: ["Chicken Wings", "Garlic Bread", "Mozzarella Sticks"],
//       mains: ["Burger", "Pizza", "Salad"],
//       desserts: ["Ice Cream", "Chocolate Cake", "Tiramisu"],
//       drinks: ["Coffee", "Tea", "Soda", "Water"],
//     },
//     lastUpdated: new Date().toISOString().split("T")[0],
//   };
//   res.json(menu);
// });

// --- Skill 1 ---
// Success: 200 OK
// If route didn't exist: 404 Not Found ("Cannot GET /")
app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to our bikeshop");
});

// --- Skill 2 ---
// Success: 200 OK
// If route didn't exist: 404 Not Found ("Cannot GET /about")
app.get("/about", (req: Request, res: Response): void => {
  const about: About = {
    title: "Bicycle Shop",
    description: "In our bicycle shop we sell and repare bikes",
    funFacts: ["We love long distance bicyles", "We love quality!"],

    lastUpdated: new Date().toISOString().split("T")[0],
  };
  res.json(about);
});

// --- Skill 4, 6 and 7 ---
// Success: 200 OK
// If route didn't exist: 404 Not Found ("Cannot GET /history")
app.get("/history", (req: Request, res: Response): void => {
  const about: About = {
    title: "Bicycle Shop",
    description:
      "In our bicycle shop we sell and repare bikes. Reparing is the closest we can get to being a hospital. Selling is the closest we can get to help you purchase your dream bike.",
    funFact:
      "Did you know that we have over 20 years of experience reparing bikes, and that when you get your bike back from us 95% of our customers say their bicycle has never been more fun to bike with?",
  };
  res.status(200).json(about);
});

// --- Skill 5 ---
// Success: 200 OK
// If route didn't exist: 404 Not Found ("Cannot GET /comparing")
app.get("/comparing", (req: Request, res: Response): void => {
  // We use res.send() here instead of res.json() because the response is a
  // simple text message and not structured data.
  res.send("This is a plain text response, so res.send() is all we need.");
});

// --- skill 8 ---
app.get("/maintenance", (req: Request, res: Response): void => {
  res.status(503).send("We're down for maintenance, check back soon!");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
