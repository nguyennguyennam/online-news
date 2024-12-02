import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "src", "views"));

app.get("/login", (req, res) => {
  res.render("layouts/main-layout.ejs", {
    title: "Login",
    description: "Login page to Online News",
    content: "../pages/login",
    tailwind: true,
  });
});

app.listen(3000, () => {
  console.log("server started");
});
