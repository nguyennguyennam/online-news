import expressAsyncHandler from "express-async-handler";
import { getAllCategories } from "../queries/categories.query.js";
import { getPostsTagged } from "../queries/posts.query.js";

/**
 * GET /tag: <REDACTED>
 *
 * - Clearance Level: 0
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + I do not know what this route does.
 * - Addendum:
 *   + Always 302/Found: redirect to /.
 */
export const getTagHandler = expressAsyncHandler(async (req, res) => {
  res.redirect("/");
});

/**
 * GET /tag/:slug: Retrieves posts under a tag.
 *
 * - Clearance Level: 0
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + Accepts params { slug }.
 * - Addendum:
 *   + Always 200/OK: renders pages/tag-grid with articles under.
 */
export const getTagIdHandler = expressAsyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const categories = await getAllCategories();
  const articles = await getPostsTagged(slug);

  res.render("layouts/main-layout", {
    title: `Articles tagged #${slug}`,
    description: `A curated list of articles tagged with #${slug}`,
    content: "../pages/tag-grid",
    categories,
    articles,
    tagName: slug,
  });
});
