const mongoose = require ("mongoose");

const sectionSchema = new mongoose.Schema ({
    section: Array,
});

const Section = mongoose.model ("section", sectionSchema, "section");

module.exports =  Section;