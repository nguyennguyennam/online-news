import mongoose from "mongoose";
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
    .match(cat ? { "category.name": cat } : {})
    .match(tag ? { "tags.tag": { $in: [tag] } } : {});
  return await aggregate.skip((page - 1) * 5).limit(5);
}

/**
 * Retrieves the post with ID.
 * @param {string} id
 * @returns {Promise<Array<any>>} an array of posts, having length 0 or 1.
 */
export async function getPost(id) {
  return Post.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(id) })
    .lookup({
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    })
    .unwind("$category")
    .lookup({
      from: "categories",
      localField: "category.parent",
      foreignField: "_id",
      as: "category.parent",
    })
    .unwind("$category.parent")
    .lookup({
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    })
    .lookup({
      from: "users",
      localField: "writer",
      foreignField: "_id",
      as: "writer",
    })
    .unwind("$writer")
    .lookup({
      from: "users",
      localField: "editor",
      foreignField: "_id",
      as: "editor",
    })
    .unwind("$editor")
    .limit(1);
}

/**
 * Retrieves related posts to a post.
 *
 * A post is considered related if they have the same category, match some of the tags,
 * be written by the same writer, or approved by the same editor.
 *
 * @param {string?} id the post ID
 * @returns {Promise<Array<any>>} an array of posts related, can be empty.
 */
export async function getRelatedPosts(id) {
  const post = await Post.findById(id);
  if (post == null) return [];

  return Post.aggregate()
    .match({
      _id: { $nin: [new mongoose.Types.ObjectId(id)] },
    })
    .match({
      $or: [
        {
          category: post.category,
        },
        {
          tags: {
            $in: post.tags,
          },
        },
        {
          writer: post.writer,
        },
        {
          editor: post.editor,
        },
      ],
    })
    .sample(5);
}
