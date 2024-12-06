const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema({
    name: String,
    email: String,
    date_of_birth: Date,
    role: String,
    nickname: String
});

const Writer = mongoose.model("writer", writerSchema, "wrtier");


module.exports = Writer;