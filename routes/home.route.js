import express from "express";
import { homeGetHandler } from "../controllers/home.controller.js";

const app = express.Router();
app.get("/home", homeGetHandler);

export default app;
