import express from "express";
import adminRouter from "./admin.route.js";
import categoryRouter from "./category.route.js";
import editRouter from "./edit.route.js";
import homeRouter from "./home.route.js";
import postRouter from "./post.route.js";
import postsRouter from "./posts.route.js";
import profileRouter from "./profile.route.js";
import searchRouter from "./search.route.js";
import tagRouter from "./tag.route.js";
import userRouter from "./user.routes.js";

const mainRouter = express.Router();

mainRouter.use("/search", searchRouter);
mainRouter.use("/category", categoryRouter);
mainRouter.use("/posts", postsRouter);
mainRouter.use("/post", postRouter);
mainRouter.use("/tag", tagRouter);
mainRouter.use("/profile", profileRouter);
mainRouter.use("/admin", adminRouter);
mainRouter.use("/edit", editRouter);

mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);

export default mainRouter;
