import express from "express";
import { fetch_Cat_tag } from "../controllers/writer.controller";
const router = express.Router();

router.get("/", fetch_Cat_tag)



