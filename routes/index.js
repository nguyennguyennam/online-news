import app from "./home.route.js";
import userRouter from "./user.routes.js";
import express from "express";
const mainRouter = express.Router();

mainRouter.use("/", userRouter);

export default mainRouter;
