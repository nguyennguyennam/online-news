import express from "express";
import allRouter from "./all.route.js";
import homeRouter from "./home.route.js";
import postRouter from "./post.route.js";
import userRouter from "./user.routes.js";
import writerRouter from "./writer.route.js";

const mainRouter = express.Router();

mainRouter.use("/all", allRouter);
mainRouter.use("/post", postRouter);
mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);
mainRouter.use("/", writerRouter);
export default mainRouter;
