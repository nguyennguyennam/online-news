import express from "express";
import allRouter from "./all.route.js";
import homeRouter from "./home.route.js";
import userRouter from "./user.routes.js";

const mainRouter = express.Router();

mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);
mainRouter.use("/all", allRouter);

export default mainRouter;
