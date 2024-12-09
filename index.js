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
    description: "Login to your personal feed on Online News",
    content: "../pages/login",
  });
});

app.get("/register", (req, res) => {
  res.render("layouts/main-layout.ejs", {
    title: "Register",
    description: "Register page to Online News",
    content: "../pages/register",
  });
});

app.get("/", (req, res) => {
  res.render("layouts/main-layout.ejs", {
    title: "Home",
    description: "Home page of Online News",
    content: "../pages/home",
  });
});

app.listen(3000, () => {
  console.log("server started");
});
