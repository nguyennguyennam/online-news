import postModel from "../model/post.model.js";
import editorModel from "../model/editor.model.js";
import categoryModel from "../model/category.model";
import tagModel from "../model/tag.model";

export async function getEditorCategories(editor_id) {
  const result = await editorModel.aggregate([
    // Lọc editor theo editor_id
    {
      $match: {
        user: mongoose.Types.ObjectId(editor_id),
      },
    },
    // Join với bảng categories để lấy thông tin chi tiết danh mục
    {
      $lookup: {
        from: "categories", // Tên collection categories
        localField: "authorizedCategories", // Trường trong editors
        foreignField: "_id", // Trường trong categories
        as: "categoryDetails", // Tên trường chứa dữ liệu join
      },
    },
    // Giữ lại các trường cần thiết
    {
      $project: {
        _id: 0, // Không trả về _id của editor
        categoryDetails: {
          _id: 1, // ID của danh mục
          name: 1, // Tên của danh mục
        },
      },
    },
  ]);

  if (result.length === 0) {
    throw new Error("Editor not found or no categories found");
  }

  // Trả về danh sách danh mục
  return result[0].categoryDetails;
}

export async function list_draft(editor_id, page = 1, limit = 5) {
  // Lấy danh mục mà editor quản lý
  const authorizedCategories = await getEditorCategories(editor_id);

  // Trích xuất danh sách ID từ danh mục
  const categoryIds = authorizedCategories.map((category) => category._id);

  let list_posts = await postModel.aggregate([
    // Lọc các bài viết ở trạng thái "draft"
    {
      $match: {
        state: "draft",
        category: { $in: categoryIds }, // Chỉ lấy bài viết thuộc danh mục mà editor quản lý
      },
    },
    // Join với bảng categories để lấy thông tin chi tiết danh mục của bài viết
    {
      $lookup: {
        from: "categories", // Collection category
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    // Giải nén mảng categoryInfo
    {
      $unwind: "$categoryInfo",
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    // Chỉ chọn các trường cần thiết trả về
    {
      $project: {
        _id: 1,
        name: 1, // Tên bài viết
        category: "$categoryInfo.name", // Tên danh mục
        state: 1,
        writtenDate: 1,
      },
    },
  ]);
  const total_Draft_post = await postModel.countDocuments({
    state: "Draft",
    category: { $in: categoryIds },
  });
  const totalPage = total_Draft_post / limit + 1;
  return {
    list_posts,
    pagination: {
      currentPage: page,
      totalPage,
      limit: limit,
    },
  };
}

export async function checkPost(
  status,
  post_id,
  reason,
  category,
  tags,
  datePublish,
) {
  if (!["deny", "approved"].includes(status)) {
    throw new Error("Invalid status. Allowed values: 'deny', 'approved'.");
  }

  if (status === "deny") {
    // Xử lý từ chối bài viết
    return await postModel.findByIdAndUpdate(
      post_id, // Truy vấn dựa trên _id
      {
        state: status,
        reason_of_deny: reason, // Lý do từ chối
      },
      { new: true }, // Trả về bài viết đã cập nhật
    );
  } else if (status === "approved") {
    // Kiểm tra ngày xuất bản hợp lệ
    const now = new Date();
    if (new Date(datePublish) < now) {
      throw new Error("Publish date must be in the future.");
    }

    // Xử lý duyệt bài viết
    return await postModel.findByIdAndUpdate(
      post_id, // Truy vấn dựa trên _id
      {
        state: status,
        category: category, // Chuyên mục
        tags: tags, // Nhãn
        publishedDate: datePublish, // Ngày xuất bản
      },
      { new: true }, // Trả về bài viết đã cập nhật
    );
  }
}
