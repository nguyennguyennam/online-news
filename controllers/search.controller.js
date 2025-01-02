import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { getAllCategories } from "../queries/categories.query.js";
import { getAllPosts } from "../queries/posts.query.js";
import Post from "../model/post.model.js";

/**
 * GET /search: Retrieves all posts.
 *
 * - Clearance Level: 0
 * - Accepts query: { query: string, page: number, cat: string, tag: string }
 * - Mutates: none
 * - Renders:
 *   + File pages/400 with main-layout: if there was a schema parse error.
 *   + File pages/search with main-layout: if it was success.
 */
export const searchGetHandler = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().positive().default(1),
    cat: z.string().optional(),
    tag: z.string().optional(),
  });
  const query = schema.safeParse(req.query);

  if (query.error) {
    res.render("layouts/main-layout", {
      title: "400",
      description: "There was a client error.",
      message: query.error.issues[0].message,
      content: "../pages/400",
    });
    return;
  }

  const postsPerPage = 9; // Số bài viết mỗi trang

  // Đếm tổng số bài viết thỏa mãn điều kiện
  const totalPosts = await Post.countDocuments({
    state: "published",
    ...(query.data.cat ? { "category.name": query.data.cat } : {}),
    ...(query.data.tag ? { tags: { $elemMatch: { tag: query.data.tag } } } : {}),
    ...(query.data.query ? { $text: { $search: query.data.query } } : {}),
  });

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // How to get the UserId?
  const page = query.data.page || 1; 
  const result = await getAllPosts({ ...query.data, page: page, postsPerPage: postsPerPage });
  const categories = await getAllCategories();
  // console.log({
  //   query: query.data.query,
  //   posts: result,
  //   totalPosts: totalPosts,
  // });
  res.render("layouts/main-layout", {
    title: "All posts",
    description:
      "A curated list of all posts written by talented journalists of The Cipher.",
    content: "../pages/search",
    searchQuery: query.data.query,
    posts: result,
    categories,
    currentPage: page,
    totalPosts,
    totalPages,
  });
});