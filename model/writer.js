import mongoose from "mongoose";

const writerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensures no duplicate emails
    dateOfBirth: { type: Date, required: true }, // Changed `date_of_birth` to camelCase for consistency
    role: { type: String, required: true },
    nickname: { type: String }
});

const Writer = mongoose.model("Writer", writerSchema, "writer");
export default Writer;
