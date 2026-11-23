import express from "express";
import cors from "cors";
const app = express();
const PORT = 8080;
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({ cars: ["Mercedes", "Toyota", "Ford", "Opel", "Volvo"] });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
