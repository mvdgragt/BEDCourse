import express from "express";

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to our restaurant");
});

app.get("/menu", (req, res) => {
  const menu = {
    restaurant: "My First Restaurant",
    categories: {
      appetizers: ["Chicken Wings", "Garlic Bread", "Mozzarelly Sticks"],
      mains: ["Burger", "Pizza", "Salad"],
      desserts: ["Ice Cream", "Chocolate Cake", "Tiramisu"],
      drinks: ["Coffee", "Tea", "Soda", "Water"],
    },
    lastUpdated: new Date().toISOString().split("T")[0],
  };
  res.json(menu);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
