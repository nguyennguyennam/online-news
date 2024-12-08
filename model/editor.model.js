import mongoose from "mongoose";

const editorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  authorizedCategories: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
    },
  ],
  usableCategories: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
    },
  ],
});

export default EditorProfile = mongoose.model(
  "EditorProfile",
  editorProfileSchema,
  "editors",
);
