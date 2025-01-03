import express from "express";
import expressAsyncHandler from "express-async-handler";
import { clearanceCheck } from "../controllers/middlewares.js";
import { subscribe } from "../queries/users.query.js";
import adminRouter from "./admin.route.js";
import categoryRouter from "./category.route.js";
import editRouter from "./edit.route.js";
import editorRouter from "./editor.route.js";
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
mainRouter.use("/editorial", editorRouter);
mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);

mainRouter.get(
  "/subscribe",
  clearanceCheck(1),
  expressAsyncHandler(async (req, res) => {
    await subscribe(req.session.userInfo.id);
    res.redirect("/profile");
  }),
);

export default mainRouter;
