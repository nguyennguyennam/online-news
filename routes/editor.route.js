import express from "express";
import { fetched_posts_handler } from "../controllers/editor.controller.js";
const editorRouter = express.Router();

editorRouter.get("/", fetched_posts_handler);

export default editorRouter;
