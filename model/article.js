const mongoose = require("mongoose");

    const articleSchema = new mongoose.Schema({
            title: String,
            author: String,
            content: Text,
            datePublished: Date,
            category: String,
            tag: String,
            status: String, //approval, denial or unchecked
            type: String,  // Draft or Publised
            reason_of_denial: String
    })
    const article = mongoose.model("article", articleSchema);

module.exports = article;