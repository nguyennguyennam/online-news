import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import { z } from "zod";
import {
  findCategoryBySlug,
  findChildCategoryBySlug,
  getAllCategories,
  getChildrenCategoriesOf,
} from "../queries/categories.query.js";
import { getPostsUnderCategory } from "../queries/posts.query.js";

/**
 * GET /category/:id: Retrieves the parent ID.
 *
 * - Clearance Level: 0
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + :slug is the "slugified" version of the category's name.
 *   + This route only accepts parent categories.
 * - Addendum:
 *   + 400/Bad Request: renders pages/home
 *   + 404/Not Found: renders pages/404
 *   + 200/OK: renders pages/category-grid
 */
export const getPostByCatController = expressAsyncHandler(async (req, res) => {
  const schema = z.object({
    id: z.string(),
  });
  const params = schema.safeParse(req.params);
  if (params.error) {
    res.redirect("/");
    return;
  }

  const parentCat = await findCategoryBySlug(params.data.id);
  const categories = await getAllCategories();

  if (parentCat == null) {
    res.render("layouts/main-layout", {
      title: "Category not found",
      description: "Category was not found",
      categories,
      content: "../pages/404",
      userInfo: req.session?.userInfo,
    });
    return;
  }

  const children = (await getChildrenCategoriesOf(parentCat._id)).map((n) => ({
    ...n,
    slug: slugify(n.name, { lower: true, strict: true, trim: true }),
  }));
  const articles = await getPostsUnderCategory(parentCat._id, true);

  res.render("layouts/main-layout", {
    title: `Category ${parentCat.name}`,
    description: "Landing page for category-specific articles",
    parentSlug: slugify(parentCat.name, {
      lower: true,
      strict: true,
      trim: true,
    }),
    categories,
    children,
    path: req.path,
    category: parentCat,
    articles,
    userInfo: req.session?.userInfo,
    content: "../pages/category-grid",
  });
});

/**
 * GET /category/:parent/:child: Retrieves posts under children categories.
 *
 * - Clearance Level: 0
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + Accepts params { parent: string, child: string }.
 * - Addendum:
 *   + 404/NotFound: rendrs pages/404
 *   + 200/OK: renders pages/category-grid
 */
export const getPostsByChildCatController = expressAsyncHandler(
  async (req, res) => {
    const schema = z.object({
      parent: z.string(),
      child: z.string(),
    });
    const params = schema.safeParse(req.params);
    if (params.error) {
      res.redirect("/");
      return;
    }

    const parentCat = await findCategoryBySlug(params.data.parent);
    const category = await findChildCategoryBySlug(
      params.data.parent,
      params.data.child,
    );
    if (parentCat == null || category == null) {
      res.render("layouts/main-layout", {
        title: "Category not found",
        description: "Category was not found",
        categories,
        content: "../pages/404",
        userInfo: req.session?.userInfo,
      });
      return;
    }

    const children = (await getChildrenCategoriesOf(parentCat._id)).map(
      (n) => ({
        ...n,
        slug: slugify(n.name, { lower: true, strict: true, trim: true }),
      }),
    );
    const categories = await getAllCategories();
    const articles = await getPostsUnderCategory(category._id, false);

    res.render("layouts/main-layout", {
      title: `Sub-category ${category.name}`,
      description: "Articles under a sub-category.",
      parentSlug: slugify(parentCat.name, {
        lower: true,
        strict: true,
        trim: true,
      }),
      selected: params.data.child,
      children,
      categories,
      articles,
      path: req.path,
      category,
      userInfo: req.session?.userInfo,
      content: "../pages/category-grid",
    });
  },
);
