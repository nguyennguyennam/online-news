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

  // How to get the UserId?

  const result = await getAllPosts({ ...query.data });
  const categories = await getAllCategories();
  res.render("layouts/main-layout", {
    title: "All posts",
    description:
      "A curated list of all posts written by talented journalists of The Cipher.",
    content: "../pages/search",
    searchQuery: query.data.query,
    posts: result,
    categories,
  });
});
