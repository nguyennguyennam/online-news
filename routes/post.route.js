import express from "express";
import {
  getPostHandler,
  getPostIdHandler,
  postImageHandler,
} from "../controllers/post.controller";

const router = express.Router();

router.route("/").get(getPostHandler);
router.route("/image").post(postImageHandler);
router.route("/:id").get(getPostIdHandler);

export default router;
