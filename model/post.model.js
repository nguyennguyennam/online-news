import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema({
  writer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  editor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  writtenDate: {
    type: Date,
    required: true,
    default: function () {
      return new Date();
    },
  },
  publishedDate: Date,
  state: {
    type: String,
    enum: ["draft", "denied", "approved", "published"],
    default: "draft",
  },
  thumbnail: {
    small: {
      type: String,
      required: true,
    },
    large: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    default: function () {
      const slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });
      return `${slug}-${this._id?.toString()?.slice(-6)}`;
    },
  },
  abstract: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
  },
  tags: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Tag",
    },
  ],
  content: {
    type: String, // Whatever from the text editor
    required: true,
    index: true,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  premium: {
    type: Boolean,
    required: true,
    default: false,
  },
  deniedReason: String,
});

// postSchema.index({ name: "text", abstract: "text", content: "text" });

const Post = mongoose.model("Post", postSchema, "posts");
export default Post;
