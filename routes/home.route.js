import express from "express";
import { homeGetHandler } from "../controllers/home.controller.js";

const router = express.Router();
router.route("/").get(homeGetHandler);

export default  router ;
