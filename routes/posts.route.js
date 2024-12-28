import express from "express";
import { getPostsHandler } from "../controllers/posts.controller";

const router = express.Router();
router.route("/").get(getPostsHandler);

export default router;
