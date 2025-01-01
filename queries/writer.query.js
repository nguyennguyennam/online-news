import postModel from "../model/post.model.js";
import mongoose from "mongoose";
import tagModel from "../model/tag.model.js";
import categoryModel from "../model/category.model.js";

export async function savePost(
  writerId,
  name,
  abstract,
  thumbnail_large,
  thumbnail_small,
  content,
  category,
  tags,
  premium,
) {
  const date = new Date(0);
  return await postModel.create({
    writer: writerId,
    name: name,
    writtenDate: date.toLocaleString("vi-VN", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    abstract: abstract,
    thumbnail: {
      small: thumbnail_small,
      large: thumbnail_large,
    },
    content: content,
    category: category,
    tags: tags,
    views: 0,
    premium: premium,
    status: "Draft",
  });
}

// export async function post_Lists(writer_id, page) {
//   const writerObjectId = new mongoose.Types.ObjectId(writer_id);
//   // find a number of documents in a post model to find the total pages
//   const total_posts = await postModel.countDocuments({
//     writer: writerObjectId,
//   });
//   page = 1;
//   const post_per_page = 5;
//   const total_pages = Math.ceil(total_posts / post_per_page) + 1;
//   const rawData = await postModel.aggregate([
//     { $match: { writer: writerObjectId } },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "Category details",
//       },
//     },
//     {
//       $lookup: {
//         from: "tags",
//         localField: "tags",
//         foreignField: "_id",
//         as: "Tag details",
//       },
//     },
//     { $sort: { writtenDate: -1 } }, // Sắp xếp bài viết theo thời gian
//     // {
//     //   $group: {
//     //     _id: "$state", // Nhóm theo `state`
//     //     posts: { $push: "$$ROOT" }, // Đẩy toàn bộ bài viết vào mảng `posts`
//     //   },
//     // },
//     // {
//     //   $facet: {
//     //     data: [{ $skip: (page - 1) * post_per_page }, { $limit: post_per_page }],
//     //   }
//     // }
//     {
//       $skip: page * post_per_page, // Skip posts for pagination
//     },
//     {
//       $limit: post_per_page, // Limit the number of posts per page
//     },
//   ]);
//   //85console.log(rawData)
//   return {
//     currentPage: page,
//     totalPages: total_pages,
//     postList: rawData ?? [],
//   };
// }

export async function modified_post(
  post_id,
  title,
  abstract,
  content,
  category,
  tags,
  premium,
) {
  return await postModel.findByIdAndUpdate(
    post_id,
    {
      name: title,
      abstract: abstract,
      content: content,
      category: category,
      tags: tags,
      premium: premium,
    },
    { new: true },
  );
}
