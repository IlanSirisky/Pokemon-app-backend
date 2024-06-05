import express from "express";
import dotenv from "dotenv";
import pokemonRoutes from "./routes/pokemonRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", pokemonRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
