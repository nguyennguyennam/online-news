import Article from "../model/article.js";

class WriterController {
    // Insert Article to the database
    insertArticle = async (req, res) => {
        try {
            const articleData = req.body;

            if (!articleData || typeof articleData !== "object") {
                return res.status(400).json({ message: "Fail" });
            }

            const result = await Article.insertMany(articleData);
            console.log(result);
            return res.status(200).json({ message: "Success", data: result });
        } catch (err) {
            console.error("Error while inserting article:", err.message);
            return res.status(500).json({ message: "Fail", error: err.message });
        }
    };

    // Sort articles by datePublished
    sortArticleList = (list) => {
        return list.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    };

    // Check if the article's status is valid
    checkArticleStatus = (article) => {
        return ["approval", "denial", "unchecked"].includes(article.status);
    };

    // Find articles by author's name
    findArticle = async (req, res) => {
        try {
            const author = req.query.author;

            if (!author) {
                return res.status(400).json({ message: "Fail" });
            }

            const articles = await Article.find({ author });

            if (articles.length === 0) {
                return res.status(404).json({ message: "Fail" });
            }

            return res.status(200).json({
                message: "Success",
                data: articles,
            });
        } catch (err) {
            console.error("Error finding articles:", err.message);
            return res.status(500).json({ message: "Fail", error: err.message });
        }
    };

    // Find specific article content by ID
    findArticleContent = async (req, res) => {
        try {
            const articleId = req.params.id;

            if (!articleId) {
                return res.status(400).json({ message: "Fail" });
            }

            const article = await Article.findById(articleId);

            if (!article) {
                return res.status(404).json({ message: "Fail" });
            }

            return res.status(200).json({
                message: "Success",
                data: article,
            });
        } catch (err) {
            console.error("Error finding article content:", err.message);
            return res.status(500).json({ message: "Fail", error: err.message });
        }
    };

    // Allow writer to edit articles
    editArticle = async (req, res) => {
        try {
            const articleId = req.params;
            const articleData = req.body;

            if (!articleId) {
                return res.status(400).json({ message: "Fail" });
            }

            const updatedArticle = await Article.findByIdAndUpdate(
                articleId,
                { $set: articleData },
                { new: true, runValidators: true }
            );

            if (!updatedArticle) {
                return res.status(404).json({ message: "Fail" });
            }

            return res.status(200).json({ message: "Success", data: updatedArticle });
        } catch (err) {
            console.error("Error updating article:", err.message);
            return res.status(500).json({ message: "Fail", error: err.message });
        }
    };
}

export default new WriterController();
