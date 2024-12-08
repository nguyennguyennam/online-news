import Comment from "../model/comment.model";

/**
 * Retrieves a list of posts that are "featured". Featured posts
 * are considered posts that have the most comments in the past week.
 */
export async function getFeaturedPosts() {
  return await Comment.aggregate()
    .group({
      _id: "$post",
      count: { $count: 1 },
    })
    .sort({ count: -1 })
    .lookup({
      from: "posts",
      localField: "post",
      foreignField: "_id",
      as: "post",
    })
    .unwind("post")
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
