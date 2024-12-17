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
  },
  writtenDate: {
    type: Date,
    required: true,
  },
  publishedDate: Date,
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
    index: true,
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
});

const Post = mongoose.model("Post", postSchema, "posts");

// Create full-text search support on provided fields: name, abstract, content.
// However, this only supports full-words, for example, searching "example" will work,
// but "examp" won't.
// Do we need that?
Post.createIndexes(
  {
    name: "text",
    abstract: "text",
    content: "text",
  },
  {
    weights: {
      name: 5, // Matches on the title are worth more.
      abstract: 2, // Then the abstract.
      content: 1, // If no matches, then search the content.
    },
  },
);

export default Post;
