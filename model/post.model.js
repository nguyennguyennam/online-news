import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  writer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  editor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  writtenDate: {
    type: Date,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    enum: ["draft", "denied", "approved", "published"],
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
  },
  abstract: {
    type: String,
    required: true,
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
});

export default Post = mongoose.model("Post", postSchema, "posts");
