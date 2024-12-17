//import { describe } from "vitest";
import {savePost} from "../queries/writer.query";


export function renderWriter (req, res)  {
    res.render ("layouts/main-layout", {
        title: "Writers's page",
        description: "This is a page for writer to save their posts",
        content: "../pages/create_post",
        categories: null
    })
};


export async function save_writer_post (req, res) {
    console.log("Request Body:", req.body); // Debugging
    const {name,  abstract, content, category, tags} = req.body;
    await savePost(name,  abstract, content, category, tags);
    return res.redirect("/post");
}