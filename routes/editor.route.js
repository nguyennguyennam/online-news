import express from "express";
import {
  checkPosts,
  fetched_posts_handler,
} from "../controllers/editor.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";

const editorRouter = express.Router();
editorRouter
  .route("/")
  .post(clearanceCheck(3), checkPosts)
  .get(clearanceCheck(3), fetched_posts_handler);

export default editorRouter;
