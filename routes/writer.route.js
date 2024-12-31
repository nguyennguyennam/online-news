import express from "express";
import { render_create_post, render_Writer_page, render_post_list, render_ajax_post} from "../controllers/writer.controller.js";
const router = express.Router();


router.get ("/post_list_api", render_ajax_post );
router.get ("/post_list", render_post_list );
router.get("/create-post", render_create_post);
router.get("/", render_Writer_page);

export default router;



