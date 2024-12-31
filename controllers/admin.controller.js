import expressAsyncHandler from "express-async-handler";
import { getAllCategories } from "../queries/categories.query";
import { get_all_tags } from "../queries/tag.query";
import { getAllUsers, getUser} from "../queries/users.query";
import { getAllAdminPosts } from "../queries/posts.query";
/**
 * GET /admin: Main admin tool page.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getAdminHandler = expressAsyncHandler(async (req, res) => {
    res.render("layouts/main-layout", {
        title: "Admin Tools",
        description: "Administrative tools only authorized for admins",
        content: "../pages/admin",
        userInfo: req.session?.userInfo,
    });
});

/**
 * GET /admin/categories: View all categories in the database.
 *
 * - Clearance Level: 4
 * - Object Class: Safe
 */
export const getAdminCategoriesHandler = expressAsyncHandler(
    async (req, res) => {
        const categories = await getAllCategories();
        res.render("layouts/main-layout", {
            title: "All Categories",
            description:
                "Administrative tools for viewing all current available categories",
            content: "../pages/admin-categories",
            adminCategories: categories,
            userInfo: req.session?.userInfo,
        });
    },
);

export const getAdminTagsHandler = expressAsyncHandler(
    async (req, res) => {
        const tags = await get_all_tags();
        res.render("layouts/main-layout", {
            title: "All Tags",
            description:
                "Administrative tools for viewing all current available tags",
            content: "../pages/admin-tags",
            adminTags: tags,
            userInfo: req.session?.userInfo,
        });
    },
);

export const getAdminUsersHandler = expressAsyncHandler(
  async (req, res) => {
    const users = await getAllUsers();
    res.render("layouts/main-layout", {
      title: "All Users",
      description:
        "Administrative tools for viewing all current available users",
      content: "../pages/admin-users",
      adminUsers: users,
      userInfo: req.session?.userInfo,
    });
  },
);

export const getAdminUsersEditHandler = expressAsyncHandler(
  async (req, res) => {
    const userId = req.params.id;
    try {
      // Tìm kiếm người dùng theo ID
      const userProfile = await getUser(userId);

      // Kiểm tra nếu không tìm thấy người dùng
      if (!userProfile) {
        return res.status(404).render("layouts/main-layout", {
          title: "User Not Found",
          description: "The user with the given ID does not exist.",
          content: "../pages/admin-edit-user",
          userInfo: req.session?.userInfo,
        });
      }

      // Nếu tìm thấy người dùng, render trang chỉnh sửa
      res.render("layouts/main-layout", {
        title: "Edit User",
        description: "Administrative tools editing users",
        content: "../pages/admin-edit-user",
        AdminEditUsers: userProfile,  // Truyền dữ liệu người dùng vào template
        userInfo: req.session?.userInfo,
      });
    } catch (error) {
      // Xử lý lỗi khi truy vấn
      console.error(error);
      res.status(500).send("Server error");
    }
  },
);

export const getAdminPostsHandler = expressAsyncHandler(
    async (req, res) => {
        const posts = await getAllAdminPosts();
        res.render("layouts/main-layout", {
            title: "All Posts",
            description:
                "Administrative tools for viewing all current available posts",
            content: "../pages/admin-posts",
            adminPosts: posts,
            userInfo: req.session?.userInfo,
        });
    },
);

export const update_cat_by_admin = async (req, res) => {
    const { categoryId } = req.body;
    // Debugging: Log the categoryId to check if it's being passed correctly
    console.log("Category ID:", categoryId);

    // Validate categoryId
    if (!categoryId || categoryId.trim() === "") {
        console.error("Error: Category ID is empty or invalid.");
        return res.status(400).send("Category ID is empty or invalid.");
    }
    // Extract categoryId and name from req.body
    const update_cat = updateCat(categoryId);
    res.redirect("/admin/categories");
} 
