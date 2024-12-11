import expressAsyncHandler from "express-async-handler";
import {
  getFeaturedPosts,
  getMostViewedPosts,
  getNewestPosts,
  getNewestPostsFromEachCategory,
} from "../queries/posts.query.js";

/**
 * GET /: Renders the main page, with the main layout.
 *
 * - Clearance Level: 0
 * - Object Class: Safe
 * - Passes down: list of featured posts, most viewed posts, newest posts and newest posts from each category.
 * - Mutates: nothing
 */
export const homeGetHandler = expressAsyncHandler(async (req, res) => {
  const [featured, mostViewed, newest, newestEach] = await Promise.all(
    getFeaturedPosts(),
    getMostViewedPosts(),
    getNewestPosts(),
    getNewestPostsFromEachCategory(),
  );

  res.render("layouts/main-layout", {
    featured,
    mostViewed,
    newest,
    newestEach,
    title: "The Cipher",
    description: "The homepage of the online news website, The Cipher.",
    content: "../pages/home",
    homeData: {
      featuredArticles: featured,
      mostViewedArticles: mostViewed,
      latestArticles: newest,
      topCategories: newestEach,
    },
  });
});
