const Admin = require("../model/admin");
const article = require("../model/article");
const editor = require("../model/editor");
const tag = require ("../model/tag");

class adminController {
    renderAdmin(req, res) {
        res.render("admin");
    }
    showCategory = async (req, res) => {
        try {
            const category_list = await Admin.find({}, { category: 1, _id: 0 });
            res.render("", category_list);
        }
        catch (err) {
            res.render("", err);
        }
    }
    addCategory = async (req, res) => {
        try {
            const new_category = req.body;
            const updated_category = await Admin.updateMany({},
                { $push: { category: new_category } }
            );
            res.render("", { message: `Updated succesfully: ${updated_category}` });
        }
        catch (err) {
            res.render("", { message: `Error while adding new category: ${err}` });
        }
    }
    // Fetch all category admin has
    fetchAllCategory = async (req, res) => {
        try {
            // Lấy danh sách category
            const category_list = await Admin.find({}, { category: 1, _id: 0 });

            // Kiểm tra nếu không có dữ liệu
            if (category_list.length === 0) {
                return res.render("categories", { message: "No categories found!" });
            }

            // Render danh sách category
            res.render("categories", {
                message: "Category list fetched successfully",
                categories: category_list.map((item) => item.category), // Chỉ lấy mảng category
            });
        } catch (err) {
            // Xử lý lỗi và hiển thị thông báo trên giao diện
            res.render("categories", {
                message: `Error while fetching all categories: ${err.message}`,
            });
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const delete_category = req.body;
            const category_deleted = await Admin.deleteMany({}, {
                category: delete_category,
            });
            res.render("", {
                message: "Deleted succesfully",
                categories_after_deleted: category_deleted.map((item) => item.category),
            })
        }
        catch (err) {
            message: `Error while deleting categories categories: ${err.message}`
        }
    }
    // Show tag from article
    showTagfromArticle = async (req, res) => {
        try {
            const tagList = await tag.find({}, {tag: 1, _id: 0});
            res.render("", {message: `Tag found: ${tagList}`});
        }
        catch (err) {
            res.render ("", {message: `Error while showing tag from article: ${err}`});
        }
    }

    editTagfromArticle = async (req, res) => {
        try {
            const tag_edit = req.body.tag;
            await tag.findOneAndUpdate({tag: tag});
        }
    }

    // fetch all Approved Article

    fetchApprovedArticle = async (req, res) => {
        try {
        const approved_article = await article.find({status: 'Approved'});
        res.render("", {message: `Approved articles: ${approved_article}`});
        }
        catch (err) {
            res.render("", {message:`Error while fetching approved articles: ${err}`});
        }
    }

    //update article from draft to Publised
    updateDraftArticle = async (req, res) => {
        try{
        const articleId = req.params.id;
        const approvedArticle = await article.findByIdAndUpdate(articleId , {type: "Publised"});
        res.render("", {message:`Update draft article succesfully: ${approvedArticle}`});
        }
        catch(err) {
            res.render("", {message: `Error while updating: ${err}`});
        }
    }

    //Fetch all editors available

    fetchEditors = async (req, res) =>{
        try {
            editors_list = await editor.find({});
            res.render("", editors_list);
        }
        catch(err) {
            res.render("", {message: `Error while fetching: ${err}`});
        }
    }
    
    //Assign categories for editor
    assignCategories = async (req, res) => {
        try {
            editorId = req.params.id;
            categories_assigned = req.body;

            const assign_category_editor = await editor.findByIdAndUpdate(editorId, {category: categories_assigned});
            res.render("", {message: `Update succesfully: ${assign_category_editor}`});
        }
        catch (err) {
            res.render("", {message:`Error while assigning: ${err}`});
        } 
    }
}

module.exports = new adminController;