const express = require("express");
const bodyParser = require("body-parser");
const dbConnection = require("./config/mongoose");
const Article = require("./model/article");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình Handlebars view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "view", "pages"));

// Kết nối MongoDB
dbConnection();

// Khởi tạo đối tượng Article
const articleController = new Article();

// Route render trang chính
app.get("/", (req, res) => {
    res.render("index", { articles: [] }); // Mặc định articles là mảng rỗng
});
// Route render trang search-author
app.get("/search-author/articles",  (req, res) => {
    articleController.findArticle(req, res);
});
app.get("/search-author", (req, res) => {
    res.render("search-author");
});

// Endpoint thêm bài viết
app.post("/article",  (req, res) => {
    articleController.insertArticle(req, res);
});


// Endpoint cập nhật bài viết
app.put("/article/:id", (req, res) => {
    articleController.editArticle(req, res);
});

// Bắt đầu server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
