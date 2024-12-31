import express from "express";
import {
  getEditHandler,
  getEditIdHandler,
} from "../controllers/edit.controller";
import { clearanceCheck } from "../controllers/middlewares";

const editRouter = express.Router();
editRouter.route("/").get(getEditHandler);
editRouter.route("/:id").get(clearanceCheck(2), getEditIdHandler);

export default editRouter;
