import express from "express";
import {
  getProfileHandler,
  postProfileHandler,
} from "../controllers/profile.controller";

const profileRouter = express.Router();
profileRouter.route("/").get(getProfileHandler).post(postProfileHandler);

export default profileRouter;