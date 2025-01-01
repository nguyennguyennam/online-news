import express from "express";
import { clearanceCheck } from "../controllers/middlewares.js";
import {
  getProfileHandler,
  postProfilePasswordHandler,
  postProfileUpdateHandler,
} from "../controllers/profile.controller.js";

const profileRouter = express.Router();
profileRouter.route("/").get(clearanceCheck(1), getProfileHandler);
profileRouter
  .route("/update")
  .post(clearanceCheck(1), postProfileUpdateHandler);
profileRouter
  .route("/password")
  .post(clearanceCheck(1), postProfilePasswordHandler);

export default profileRouter;
