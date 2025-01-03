import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { getAllCategories } from "../queries/categories.query.js";
import { getAllPosts } from "../queries/posts.query.js";

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

  const queryResult = await getAllPosts({
    userId: req.session.userInfo?.id,
    query: query.data.query,
    postsPerPage: 5,
    page: query.data.page,
  });
  const categories = await getAllCategories();
  const count = queryResult[0].count[0].count;

  res.render("layouts/main-layout", {
    title: "All posts",
    description:
      "A curated list of all posts written by talented journalists of The Cipher.",
    content: "../pages/search",
    searchQuery: query.data.query,
    posts: queryResult[0].results,
    categories,
    currentPage: query.data.page,
    totalPosts: count,
    totalPages: Math.ceil(count / 5),
    userInfo: req.session?.userInfo,
  });
});
