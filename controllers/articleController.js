//this controller is used for writer's article.
const Article = require("../model/article");

class  writerController{
    //Insert Article to the database
    insertArticle = async (req, res) => {
        const article_fetched = req.body;

        if (!article_fetched || typeof article_fetched !== 'object') {
            return res.status(400).json({ message: "Invalid article data" });
        }
        await this.Article.insertMany(article_fetched).then(() => {
            console.log(article_fetched);
            return res.status(200).json({ message: `Inserted article succesfully: ${article_fetched}` });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ message: "Error while inserting: ${err.message}" });
        })
    }

    sortArticle_list(list) {
        return list.sort((a, b) => { new Date(b.datePublished) - new Date(a.datePublished) });
    }

    checkArticleStatus(article) {
        return ["Upapproval", "denial"].includes(article.status);
    }

    //Partly update data in an object

    // Find Article based on the name of the author.
    findArticle = async (req, res) => {
        try {
            console.log("Raw fetched article", req.query);
            const author_req = req.query.author;
            if (!author_req) {
                return res.status(400).json({ message: "Author field is required" });
            }
            const article_list = await this.Article.find({author: author_req });
            if (article_list.length === 0) {
                return res.status(404).json({ message: "No data is found" });
            }
            else {
                return res.status(200).json({ 
                    message: "Data is found",
                    data: article_list // Trả về danh sách bài viết
                });
        } 
    } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }
    
    // Find specific article's content based on the article ID.
    findArticleContent = async (req, res) => {
        try {
            console.log("Raw fetched data", req.params.id);
            const articleId = req.params.id;
            
            if (!articleId || articleId.length === 0) {
                return res.status(400).json("Article ID is empty or invalid articleID");
            }
            else {
                const article = this.Article.find({_id: articleId});
                if (article.length === 0) {
                    return res.status(200).json({
                        message: "article data found!",
                        data: article
                    });
                }
            }
        } catch(err) {
            return res.status(500).json(`Error when finding article Data: ${err}`);
        }
    }

        //Allow writer to edit articles.
        editArticle = async (req, res) => {
            try {
                const articleId = req.body._id; // Lấy articleId từ params
                const articleData = req.body;

                // Kiểm tra trạng thái bài báo
                if (!articleData.status || articleData.status.length === 0) {
                    return res.status(400).send("Article needs reviewing!");
                }

                if (!this.checkArticleStatus(articleData)) {
                    return res.status(400).send("Invalid article status!");
                }

                // Cập nhật bài báo
                const updatedArticle = await this.Article.findByIdAndUpdate(
                    articleId,
                    { $set: articleData },
                    { new: true, runValidators: true }
                );

                if (!updatedArticle) {
                    return res.status(404).json({ message: "Cannot update article!" });
                }

                return res.status(200).json({ message: "Article updated successfully!", updatedArticle });
            } catch (err) {
                console.error("Error updating article:", err.message);
                return res.status(500).json({ message: `Error updating article: ${err.message}` });
            }
        };
}

module.exports = new writerController;