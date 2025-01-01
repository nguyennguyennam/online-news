import express from "express";
import {
  getEditHandler,
  getEditIdHandler,
} from "../controllers/edit.controller.js";
import {update_post} from "../controllers/post.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";

const editorRouter = express.Router();
editorRouter.route("/").get(getEditHandler);
editorRouter.route("/:id").post(update_post);
editorRouter.route("/:id").get(clearanceCheck(2), getEditIdHandler);

export default editorRouter;