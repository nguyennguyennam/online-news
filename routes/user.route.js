import express from "express";

const userRouter = express.Router();

userRouter.get("/login", (req, res) => {
  res.render("layouts/main-layout.ejs", {
    title: "Login",
    description: "Login to your personal feed on Online News",
    content: "../pages/login",
    activeCategory: "login",
  });
});

userRouter.get("/register", (req, res) => {
  res.render("layouts/main-layout.ejs", {
    title: "Register",
    description: "Register page to Online News",
    content: "../pages/register",
    activeCategory: "register",
  });
});

export { userRouter };
