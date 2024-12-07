import mongoose from "mongoose";
const editorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }, // Fixed `dateofBirth` to `dateOfBirth` for camelCase consistency
    email: { type: String, required: true, unique: true }, // Added uniqueness to email
    role: { type: String, required: true },
    category: { type: [String], default: [] } // Explicitly defined as an array of strings
});

const Editor = mongoose.model("Editor", editorSchema, "editor");

export default Editor;

