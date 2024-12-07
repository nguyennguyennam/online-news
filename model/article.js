import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true }, // Fixed `Text` to `String`
    datePublished: { type: Date, default: Date.now },
    category: { type: String, required: true },
    tag: { type: String },
    status: {
        type: String,
        enum: ["approval", "denial", "unchecked"], // Restricted to specific values
        default: "unchecked"
    },
    type: {
        type: String,
        enum: ["Draft", "Published"], // Restricted to "Draft" or "Published"
        default: "Draft"
    },
    reasonOfDenial: { type: String }, // Fixed naming to camelCase
    likes: {type: int, require: true},
    views: {type: int, require: true}
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
