import express from "express";
import homeRouter from "./home.route.js";
import userRouter from "./user.routes.js";
import writerRouter from "./writer.route.js";
const mainRouter = express.Router();

mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);
mainRouter.use("/", writerRouter);
export default mainRouter;
