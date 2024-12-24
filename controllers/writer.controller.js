import {fetch_sub_Cat} from "../queries/categories.query.js";
import { get_all_tags } from "../queries/tag.query.js";
import {savePost, post_Lists} from "../queries/writer.query.js";
import slugify from "slugify";

export async function render_Writer_page (req, res) {
    try {
    res.render ("layouts/writer_header", {
        title: "Rendering writer pages",
        description: "Rendering the main page for writer, including creating posts, list posts and modifying it",
        content: "../pages/create-post"
    })}
    catch (error) {
        console.error("Error in render_writer_post:", error); // Ghi log lỗi
        res.status(500).send(`
            <h1>Internal Server Error</h1>
            <p>Error Message: ${error.message}</p>
            <pre>${error.stack}</pre>
        `);
    }
};
export async function render_create_post(req, res) {
    try {
        const [categories, tags] = await Promise.all([
            fetch_sub_Cat(),
            get_all_tags(),
        ]);

        res.render("layouts/writer_header", {
            title: "Creating posts",
            description: "Writer writes articles in this page",
            content: "../pages/create-post",
            categories,
            tags,
        });
    } catch (error) {
        console.error("Error in render_create_post:", error); // Ghi log lỗi
        res.status(500).send(`
            <h1>Internal Server Error</h1>
            <p>Error Message: ${error.message}</p>
            <pre>${error.stack}</pre>
        `);
    }
}

export async function render_post_list(req, res) {
        return res.render("layouts/writer_header", {
            title: "Post list writer",
            content: "../pages/post-list"
        })
}

export async function render_ajax_post(req, res) {
    try {
        console.log("Route reached: render_post_list");
        const {writer_id, page} = req.query;

        if (!writer_id) {
            return res.status(400).json({ error: "writer_id is required" });
        }

        const post_list = await post_Lists(writer_id, page);
        console.log("post_list:", JSON.stringify(post_list, null, 2));
        return res.json({
            post_list
        })
    } catch (error) {
        console.error("Error in render_post_list:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function save_writer_post(req, res) {
    try {
        const { title, content, category, tags, thumbnail_small, thumbnail_large, abstract } = req.body;
        if (!title || !content || !category || !tags || !thumbnail_small || !thumbnail_large || !abstract) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        const post = await savePost({
            ...req.body,
            writer: writerId,
        });
        return res.redirect("/writer/create-post", {message: "success"});
    } catch (error) {
        console.error("Error in save_writer_post:", error);
        return res.redirect("/writer/create-post", {message: "fail"});
    }
}





