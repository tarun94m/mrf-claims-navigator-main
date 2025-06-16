import express from "express";
import cors from "cors";
import mrfRoutes from "./routes/mrfRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { initDirectories } from "./utils/fileUtils.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", mrfRoutes);

// Fallback handlers
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

const startServer = async () => {
  await initDirectories();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch(console.error);
