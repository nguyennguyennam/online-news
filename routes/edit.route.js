import express from "express";
import {
  getEditHandler,
  getEditIdHandler,
} from "../controllers/edit.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";
import { update_post } from "../controllers/post.controller.js";

const editRouter = express.Router();
editRouter.route("/").get(clearanceCheck(3), getEditHandler);
editRouter
  .route("/:id")
  .post(clearanceCheck(2), update_post)
  .get(clearanceCheck(2), getEditIdHandler);

export default editRouter;
