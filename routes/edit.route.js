import express from "express";
import {
  getEditHandler,
  getEditIdHandler,
} from "../controllers/edit.controller.js";
import { clearanceCheck } from "../controllers/middlewares.js";

const editRouter = express.Router();
editRouter.route("/").get(getEditHandler);
editRouter.route("/:id").get(clearanceCheck(2), getEditIdHandler);

export default editRouter;
