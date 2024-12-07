const mongoose = require ("mongoose");

const tagSchema = new mongoose.Schema({
    tag: String,
});

const tag = mongoose.model ("tag", tagSchema, "tag");

module.exports = tag;