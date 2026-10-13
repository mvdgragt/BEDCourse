import express from "express";
import mongoose from "mongoose";
const port = 3000;

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/myfirstdatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to get items" });
  }
});

app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to post an item" });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedData) {
      return res.status(404).json({ error: "item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update an item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteditem = await Item.findByIdAndDelete(id);
    if (!deleteditem) {
      return res.status(404).json({ error: "item not found" });
    }
    res.json({ message: "Item deleted", item: deleteditem });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete an item" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
