import Admin from "../model/admin.js";
import Article from "../model/article.js";
import Editor from "../model/editor.js";
import Tag from "../model/tag.js";

export const renderAdmin = (req, res) => {
    res.render("admin");
};

export const showCategory = async (req, res) => {
    try {
        const category_list = await Admin.find({}, { category: 1, _id: 0 });
        res.render("categories", { message: "success", categories: category_list });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.render("categories", { message: "fail" });
    }
};

export const addCategory = async (req, res) => {
    try {
        const newCategory = req.body.category;
        await Admin.updateMany({}, { $push: { category: newCategory } });
        res.render("categories", { message: "success" });
    } catch (err) {
        console.error("Error adding category:", err);
        res.render("categories", { message: "fail" });
    }
};

export const fetchAllCategory = async (req, res) => {
    try {
        const category_list = await Admin.find({}, { category: 1, _id: 0 });
        res.render("categories", {
            message: category_list.length ? "success" : "fail",
            categories: category_list.length ? category_list : [],
        });
    } catch (err) {
        console.error("Error fetching all categories:", err);
        res.render("categories", { message: "fail" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleteCategory = req.body.category;
        await Admin.updateMany({}, { $pull: { category: deleteCategory } });
        res.render("categories", { message: "success" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.render("categories", { message: "fail" });
    }
};

export const showTagFromArticle = async (req, res) => {
    try {
        const tagList = await Tag.find({}, { tag: 1, _id: 0 });
        res.render("tags", { message: "success", tags: tagList });
    } catch (err) {
        console.error("Error showing tags from article:", err);
        res.render("tags", { message: "fail" });
    }
};

export const editTagFromArticle = async (req, res) => {
    try {
        const { oldTag, newTag } = req.body;
        await Tag.findOneAndUpdate({ tag: oldTag }, { tag: newTag });
        res.render("tags", { message: "success" });
    } catch (err) {
        console.error("Error editing tag from article:", err);
        res.render("tags", { message: "fail" });
    }
};

export const fetchApprovedArticle = async (req, res) => {
    try {
        const approvedArticles = await Article.find({ status: "Approved" });
        res.render("articles", { message: "success", articles: approvedArticles });
    } catch (err) {
        console.error("Error fetching approved articles:", err);
        res.render("articles", { message: "fail" });
    }
};

export const updateDraftArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        await Article.findByIdAndUpdate(articleId, { status: "Published" });
        res.render("articles", { message: "success" });
    } catch (err) {
        console.error("Error updating draft article:", err);
        res.render("articles", { message: "fail" });
    }
};

export const fetchEditors = async (req, res) => {
    try {
        const editorsList = await Editor.find({});
        res.render("editors", { message: "success", editors: editorsList });
    } catch (err) {
        console.error("Error fetching editors:", err);
        res.render("editors", { message: "fail" });
    }
};

export const assignCategories = async (req, res) => {
    try {
        const editorId = req.params.id;
        const categoriesAssigned = req.body.categories;
        await Editor.findByIdAndUpdate(editorId, { category: categoriesAssigned });
        res.render("editors", { message: "success" });
    } catch (err) {
        console.error("Error assigning categories:", err);
        res.render("editors", { message: "fail" });
    }
};
