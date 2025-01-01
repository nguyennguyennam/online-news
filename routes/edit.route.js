import express from "express";
import {
  getEditHandler,
  getEditIdHandler,
} from "../controllers/edit.controller.js";
import { update_post } from "../controllers/post.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";
const editRouter = express.Router();
editRouter.route("/").get(getEditHandler);
editRouter.route("/:id").post(update_post);
editRouter.route("/:id").get(clearanceCheck(2), getEditIdHandler);

export default editRouter;
