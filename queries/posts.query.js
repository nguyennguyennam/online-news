import mongoose from "mongoose";
import slugify from "slugify";
import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { hasSubscription } from "./users.query.js";

// I have no clue why it's not preloaded. But you need to import this to make it so
// .populate understands where "Tag" is.
// Don't remove this.
import "../model/tag.model.js";
import { getOrCreate } from "./tag.query.js";

/**
 * Retrieves a list of 4 posts that are "featured". Featured posts
 * are considered posts that have the most comments in the past week.
 */
export async function getFeaturedPosts() {
  const lastWeek = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  return await Comment.aggregate()
    .match({ postedDate: { $gte: lastWeek } })
    .group({
      _id: "$post",
      count: { $count: {} },
    })
    .lookup({
      from: "posts",
      localField: "_id",
      foreignField: "_id",
      as: "post",
    })
    .unwind("$post")
    .match({ "post.state": "published" })
    .sort({ count: -1 })
    .limit(4)
    .lookup({
      from: "categories",
      localField: "post.category",
      foreignField: "_id",
      as: "post.category",
    })
    .unwind("$post.category")
    .replaceRoot("$post");
}

/**
 * Retrieves a list of 10 posts that have the most views of all time.
 */
export async function getMostViewedPosts() {
  return await Post.aggregate()
    .match({ state: "published" })
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
    .match({ state: "published" })
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
    .match({ state: "published" })
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
 * Get a post by ID.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getPostById(id) {
  const post = await Post.findById(id);
  if (post != null) {
    await post.populate("category");
    if (post.category?.parent) await post.populate("category.parent");
    await post.populate("tags");
    await post.populate("writer");
    await post.populate("editor");
  }
  return post;
}

/**
 * Retrieves all posts, given available params.
 */
export async function getAllPosts({ userId, page, query, postsPerPage }) {
  const aggregate = Post.aggregate();

  if (query) {
    aggregate.search({
      index: "default",
      text: {
        query: query,
        path: {
          wildcard: "*",
        },
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
    .match({ state: "published" })
    .facet({
      count: [{ $count: "count" }],
      results: [
        {
          $skip: (page - 1) * postsPerPage,
        },
        {
          $limit: postsPerPage,
        },
      ],
    });
  return await aggregate;
}

/**
 * Retrieves all posts in database for admin.
 *
 * @returns {Post} // all post in database
 */
export async function getAllAdminPosts() {
  return await Post.find({});
}

/**
 * Retrieves the post with the slug.
 * @param {string} id
 * @returns {Promise<any>} an array of posts, having length 0 or 1.
 */
export async function getPost(id) {
  const post = await Post.findOne({ slug: id });
  await post.populate("category");
  if (post.category?.parent) await post.populate("category.parent");
  await post.populate("tags");
  await post.populate("writer");
  await post.populate("editor");
  return post;
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
      state: "published",
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

/**
 * Deletes all posts under a certain category.
 *
 * @param {string} catId the category id
 */
export async function deletePostsUnderCategory(catId) {
  await Post.deleteMany({ category: catId });
}

/**
 * Retrieves all posts under the provided category.
 *
 * @param {string} catId
 * @returns {Promise<Array<any>>}
 */
export async function getPostsUnderCategory(catId, recurse = false) {
  return Post.aggregate()
    .match({ state: "published" })
    .lookup({
      from: "categories",
      foreignField: "_id",
      localField: "category",
      as: "category",
    })
    .unwind("$category")
    .match(
      recurse
        ? {
            $or: [
              {
                "category._id": new mongoose.Types.ObjectId(catId),
              },
              {
                "category.parent": new mongoose.Types.ObjectId(catId),
              },
            ],
          }
        : {
            "category._id": new mongoose.Types.ObjectId(catId),
          },
    )
    .lookup({
      from: "tags",
      foreignField: "_id",
      localField: "tags",
      as: "tags",
    })
    .sort({ publishedDate: -1 });
}

/**
 * Retrieves all posts tagged, sorted from newest first.
 *
 * @param {string} tag
 */
export async function getPostsTagged(tag) {
  tag = slugify(tag, { lower: true, strict: true, trim: true });
  return await Post.aggregate()
    .match({ state: "published" })
    .lookup({
      from: "tags",
      foreignField: "_id",
      localField: "tags",
      as: "tags",
    })
    .match({ tags: { $elemMatch: { tag } } })
    .sort({ publishedDate: -1 });
}

/**
 * Retrieves posts written by the ID.
 *
 * @param {string} writerId
 * @returns {Promise<Array<any>>}
 */
export async function getPostsBy(writerId) {
  return Post.aggregate()
    .match({ writer: new mongoose.Types.ObjectId(writerId) })
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
    .sort({ writtenDate: -1 });
}

/**
 * Adds one view to the post.
 *
 * @param {string} postId
 */
export async function increaseView(postId) {
  await Post.updateOne({ _id: postId }, { $inc: { views: 1 } });
}

/**
 * Creates a new post with the provided data.
 *
 * @param {any} param0 post data
 * @returns {any}
 */
export async function createPost({
  writer,
  name,
  abstract,
  category,
  tags,
  content,
  premium,
  thumbnail,
}) {
  const tagIds = await Promise.all(tags.split(",").map(getOrCreate));
  return await Post.create({
    writer,
    name,
    abstract,
    category,
    tags: tagIds.map((it) => it._id),
    state: "draft",
    thumbnail,
    content,
    premium,
  });
}
