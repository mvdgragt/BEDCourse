// backend/index.js
import express from "express";
import { verifyToken } from "./middleware/auth.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Protected route
app.get("/secure-data", verifyToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user, // Decoded token info
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
