const mongoose = require("mongoose");

const editorSchema = new mongoose.Schema({
    name: String,
    dateofBirth: Date,
    email: String,
    role: String,
    category: Array
});

const Editor = mongoose.model("editor", editorSchema, "editor");

module.exports = Editor;