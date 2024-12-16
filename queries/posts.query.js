import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { hasSubscription } from "./users.query.js";

/**
 * Retrieves a list of 4 posts that are "featured". Featured posts
 * are considered posts that have the most comments in the past week.
 */
export async function getFeaturedPosts() {
  const lastWeek = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  return await Comment.aggregate()
    .group({
      _id: "$post",
      count: { $count: {} },
    })
    .sort({ count: -1 })
    // .match({ postedDate: { $gte: lastWeek } })
    .lookup({
      from: "posts",
      localField: "post",
      foreignField: "_id",
      as: "post",
    })
    .unwind("$post")
    .lookup({
      from: "categories",
      localField: "post.category",
      foreignField: "_id",
      as: "post.category",
    })
    .limit(4)
    .project({
      _id: {
        $toString: "$post._id",
      },
      name: 1,
      category: "$post.name",
    });
}

/**
 * Retrieves a list of 10 posts that have the most views of all time.
 */
export async function getMostViewedPosts() {
  return await Post.aggregate()
    .sort({ views: -1 })
    .lookup({
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    })
    .unwind("$category")
    .lookup({
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    })
    .limit(10);
}

/**
 * Retrieves a list of 10 newest posts.
 */
export async function getNewestPosts() {
  return await Post.aggregate()
    .sort({ publishedDate: -1 })
    .lookup({
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    })
    .unwind("$category")
    .lookup({
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    })
    .limit(10);
}

/**
 * Retrieves a list of 10 categories, along with their newest posts.
 */
export async function getNewestPostsFromEachCategory() {
  return Post.aggregate()
    .sort({ publishedDate: -1 })
    .lookup({
      from: "categories",
      foreignField: "_id",
      localField: "category",
      as: "category",
    })
    .unwind("$category")
    .group({
      _id: "$category.name",
      post: { $first: "$$ROOT" },
    })
    .project({
      category: "$_id",
      post: 1,
    })
    .limit(10);
}

/**
 * Retrieves all posts, given available params.
 *
 * @param {{ userId: string?, page: number, cat: string?, tag: string?, query: string? }} param0
 */
export async function getAllPosts({ userId, page, cat, tag, query }) {
  const aggregate = Post.aggregate();

  if (query) {
    aggregate.search({
      index: "default",
      text: {
        query: query,
        path: ["name", "abstract", "content"],
        fuzzy: {
          maxEdits: 2,
          prefixLength: 0,
          maxExpansions: 50,
        },
      },
    });
  }
  if (await hasSubscription(userId)) aggregate.sort({ premium: -1 });

  aggregate
    .lookup({
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    })
    .unwind("$category")
    .lookup({
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    })
    .match(cat ? { "$category.name": cat } : {})
    .match(tag ? { tags: { $in: [tag] } } : {});
  return await aggregate.skip((page - 1) * 5).limit(5);
}
