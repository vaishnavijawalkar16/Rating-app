import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);

// Serve client build if it exists (useful when deploying server + client from same repo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "..", "client", "dist");
// Only add static serving if the client build folder exists at runtime
import fs from "fs";
if (fs.existsSync(clientDistPath)) {
	app.use(express.static(clientDistPath));
	app.get("*", (req, res) => {
		res.sendFile(path.join(clientDistPath, "index.html"));
	});
}

const PORT = process.env.PORT || 1634;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
