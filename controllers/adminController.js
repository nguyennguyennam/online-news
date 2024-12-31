import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { getAllCategories } from "../queries/categories.query.js";
import { get_all_tags } from "../queries/tag.query.js";

export async function RenderAdminDashboard(res, req) {
  const [posts, editors, writers, subscribers, categories] = await Promise.all([
    Post.find({}),
    User.find({ clearance: 3 }),
    User.find({ clearance: 2 }),
    User.find({ clearance: 1 }),
    getAllCategories(),
  ]);
  res.render("../admin-pages/dashboard", {
    posts,
    editors,
    writers,
    subscribers,
    categories,
  });
}

export async function RenderAdminArticle(res, req) {
  const posts = await Post.find({}).catch((err) => console.error(err));
  res.render("../admin-pages/articleAdmin", { posts });
}

export async function RenderAdminTag(res, req) {
  const tags = await get_all_tags().catch((err) => console.error(err));
  res.render("../admin-pages/tagAdmin", { tags });
}

export async function RenderAdminCategory(res, req) {
  const categories = await getAllCategories().catch((err) =>
    console.error(err),
  );
  res.render("../admin-pages/categoryAdmin", { categories });
}

export async function RenderAdminSubscriber(res, req) {
  const subscribers = await User.find({ clearance: 1 }).catch((err) =>
    console.error(err),
  );
  res.render("../admin-pages/subscriberAdmin", { subscribers });
}

export async function RenderAdminWriter(res, req) {
  const writers = await User.find({ clearance: 2 }).catch((err) =>
    console.error(err),
  );
  res.render("../admin-pages/writerAdmin", { writers });
}

export async function RenderAdminEditor(res, req) {
  const editors = await User.find({ clearance: 3 }).catch((err) =>
    console.error(err),
  );
  res.render("../admin-pages/editorAdmin", { editors });
}

export async function RenderAddAccountAdmin(res, req) {
  const categories = await getAllCategories().catch((err) =>
    console.error(err),
  );
  res.render("../admin-pages/addAccountAdmin", { categories });
}
