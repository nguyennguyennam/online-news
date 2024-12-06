const Editor = require("../model/editor");
const Article = require("../model/article");
const author = require("../model/writer");

class editorController {
    renderEdit(req, res) {
        res.render('editor');
    }

    //Show existing category

    showExistingCategory = async (req, res) => {
        try {
            const existingCategory = await Editor.find({}, {category:1});
            if (existingCategory.length === 0) {
                res.render("", {message: `Empty Category`});
            }
             res.render("", {message: `Category_list: ${existingCategory}`});
        }
        catch (err) {
            res.render("", {message: `Error while showing existing category: ${err}`});
        }
    }
    // Update category available 

    showNewsandAuthorByCategory = async (req, res) => {
        try {
            const categorybyID = req.query.id;
            const category_list = await Editor.find({ _id: categorybyID });

            if (category_list.length === 0) {
                return res.render("error", { message: "No category found for this ID!" });
            }
            //Show category_list by editor's ID
            articles_by_author = await this.Article.aggregrate([{
                $lookup: {
                    from: "editor",
                    localField: "category",
                    foreignField: "category",
                    as: "category_by_editor",
                },
                $lookup: {
                    from: "writer",
                    localField: "category",
                    foreignField: "category",
                    as: "category_by_author"
                },
                $match: {
                    category: { $in: category_list.map((Editor) => Editor.category) },
                },
                $project: {
                    _id: 1,
                    category: 1,
                    title: 1,
                    nickname: 1
                }
            },

            ]);
            res.render("articles", {
                message: "Found successfully",
                articles: articles_by_author,
            });
        }
        catch (err) {
            console.error("Error while finding:", err);
            res.render("error", { message: `Error while finding: ${err}` });
        }
    }
    approveArticle = async (req, res) => {
        try {
            const article_id = req.query.id_articles;
            const updated_data = req.body;
            if (!article_id) {
                res.render("", { message: "ID is empty" });
            }
            const article_info = await this.Article.find({ _id: article_id });
            if (article_info.length === 0) {
                res.render("", { message: "Not found article_info" });
            }
           const update_article_status = await this.Article.findByIdAndUpdate(
                article_id,
                {$set: updated_data},
                { new: true, runValidators: true }
           )
                res.render("", {message: "update succesfully"});
        }
        catch (err) {
            res.render("", {message: `Error while updating: ${err}`});
        }
    }
     
}
module.exports = new editorController;