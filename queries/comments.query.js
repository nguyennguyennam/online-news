import mongoose from "mongoose";
import commentModel from "../model/comment.model.js";

/**
 * Resolves an array of comments on posts.
 *
 * @param {string?} id the post ID
 * @returns an array of comments, sorted newest first.
 */
export async function getCommentsForPost(id) {
  return await commentModel
    .aggregate()
    .lookup({
      from: "posts",
      foreignField: "_id",
      localField: "post",
      as: "post",
    })
    .unwind("$post")
    .lookup({
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    })
    .unwind("$user")
    .match({ "post._id": new mongoose.Types.ObjectId(id) })
    .sort({ postedDate: -1 });
}

export async function postComment(post, user, content) {
  return await commentModel.create({
    post,
    user,
    postedDate: Date.now(),
    content,
  });
}
