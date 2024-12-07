import Editor from "../model/editor.js";
import Article from "../model/article.js";
import Author from "../model/writer.js";

class EditorController {
    renderEdit = (req, res) => {
        res.render("editor");
    };

    // Show existing categories
    showExistingCategory = async (req, res) => {
        try {
            const existingCategories = await Editor.find({}, { category: 1 });

            if (existingCategories.length === 0) {
                return res.render("error", { message: "fail" });
            }

            res.render("categories", { message: "success", data: existingCategories });
        } catch (err) {
            console.error("Error while fetching categories:", err);
            res.render("error", { message: "fail" });
        }
    };

    // Show news and author by category
    showNewsandAuthorByCategory = async (req, res) => {
        try {
            const categoryId = req.query.id;

            if (!categoryId) {
                return res.render("error", { message: "fail" });
            }

            const categoryList = await Editor.find({ _id: categoryId });

            if (categoryList.length === 0) {
                return res.render("error", { message: "fail" });
            }

            // Aggregate articles and authors by category
            const articlesByAuthor = await Article.aggregate([
                {
                    $lookup: {
                        from: "editors",
                        localField: "category",
                        foreignField: "category",
                        as: "category_by_editor",
                    },
                },
                {
                    $lookup: {
                        from: "writers",
                        localField: "category",
                        foreignField: "category",
                        as: "category_by_author",
                    },
                },
                {
                    $match: {
                        category: { $in: categoryList.map((editor) => editor.category) },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        category: 1,
                        title: 1,
                        nickname: 1,
                    },
                },
            ]);

            res.render("articles", {
                message: "success",
                articles: articlesByAuthor,
            });
        } catch (err) {
            console.error("Error while finding news and authors:", err);
            res.render("error", { message: "fail" });
        }
    };

    // Approve article
    approveArticle = async (req, res) => {
        try {
            const articleId = req.query.id_articles;
            const updatedData = req.body;

            if (!articleId) {
                return res.render("error", { message: "fail" });
            }

            const articleInfo = await Article.findById(articleId);

            if (!articleInfo) {
                return res.render("error", { message: "fail" });
            }

            await Article.findByIdAndUpdate(articleId, { $set: updatedData }, { new: true, runValidators: true });

            res.render("success", { message: "success" });
        } catch (err) {
            console.error("Error while updating article:", err);
            res.render("error", { message: "fail" });
        }
    };
}

export default new EditorController();
