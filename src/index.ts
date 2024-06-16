import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import pokemonRoutes from "./routes/pokemonRoutes";
import battleRoutes from "./routes/battleRoutes";
import errorHandler from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonRoutes);
app.use("/api/battle", battleRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello, world!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
