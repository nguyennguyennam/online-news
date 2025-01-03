import {
  CategoriesEditorHandler,
  checkPost,
  fetchPosts,
} from "../queries/editor.query.js";
//import { getUser } from "../queries/users.query.js";

export const fetched_posts_handler = async (req, res) => {
  const id_editor = req.session.userInfo?.id;
  const [posts, category_list] = await Promise.all([
    fetchPosts(id_editor),
    CategoriesEditorHandler(id_editor),
  ]);
  res.render("layouts/main-layout", {
    title: "Posts fetched",
    description: "Posts fetched by the editor",
    content: "../pages/editor-post",
    userInfo: req.session?.userInfo,
    posts: posts,
    categories_: category_list,
    categories: [],
  });
};

export const checkPosts = async (req, res) => {
  const editor_id = req.session.userInfo.id;
  const { status, post_id, reason, category, tags, datepublished } = req.body;
  await checkPost(
    editor_id,
    status,
    post_id,
    reason,
    category,
    tags,
    datepublished,
  );
  res.redirect("/editorial");
};
