import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "./queries/db.js";
import { mainRouter } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connect();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src", "views"));
app.use(mainRouter);

app.get("/fake", async (req, res) => {});

// Final middleware. This is for a catch all for server errors.
app.use((req, res) => {
  res.status(404).render("layouts/main-layout.ejs", {
    title: "404 - Not Found",
    description: "The requested page does not exist",
    content: "../pages/404",
    activeCategory: "home",
  });
});

export default app;

