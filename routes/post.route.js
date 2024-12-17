import express from "express";
import {renderWriter, save_writer_post} from "../controllers/writer.controller.js";
const router = express.Router();


router.get("/post", renderWriter);
router.post("/post", save_writer_post);
