import { posts_fetched } from "../queries/editor.query.js";

export const fetched_posts_handler = async (req, res) => {
  const id_editor = req.session.userInfo.id;
  const posts = await posts_fetched(id_editor);
  res.render("layouts/main-layout", {
    title: "Posts fetched",
    description: "Posts fetched by the editor",
    content: "../pages/editor-post",
    userInfo: req.session?.userInfo,
    posts: posts,
    categories: [],
  });
};
