import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
  },
});

export const Category = mongoose.model(
  "Category",
  categorySchema,
  "categories",
);
