import express from "express";
import { fetched_posts_handler, checkPosts } from "../controllers/editor.controller.js";
const editorRouter = express.Router();

editorRouter.post("/", checkPosts);
editorRouter.get("/", fetched_posts_handler);
export default editorRouter;
