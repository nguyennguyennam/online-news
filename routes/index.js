import express from "express";
import categoryRouter from "./category.route.js";
import homeRouter from "./home.route.js";
import postRouter from "./post.route.js";
import profileRouter from "./profile.route.js";
import searchRouter from "./search.route.js";
import tagRouter from "./tag.route.js";
import userRouter from "./user.routes.js";

const mainRouter = express.Router();

mainRouter.use("/search", searchRouter);
mainRouter.use("/category", categoryRouter);
mainRouter.use("/post", postRouter);
mainRouter.use("/tag", tagRouter);
mainRouter.use("/profile", profileRouter);

mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);

export default mainRouter;