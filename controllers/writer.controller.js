import {getAllCategories} from "../queries/categories.query.js";
import { get_all_tags } from "../queries/tag.query.js";

export  async function fetch_Cat_tag (req, res) {
    const [categories, tags] = await Promise.all ([
        getAllCategories(),
        get_all_tags(),
    ]);

    res.render ("layouts/writer_header", {
        title: "Creating posts",
        description: "Writer writes articles in this page",
        content: "../pages/create-post",
        categories,
        tags    
    })
}