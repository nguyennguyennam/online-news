import slugify from "slugify";
import tagModel from "../model/tag.model.js";

/**
 * Retrieves a tag by name, or creates it if it doesn't exist.
 * @param {string} tag  the tag
 */
export async function getOrCreate(tag) {
  const slug = slugify(tag, { lower: true, strict: true, trim: true });
  const found = await tagModel.findOne({ tag: slug });
  if (found != null) return found;
  return await tagModel.create({ tag: slug });
}

export async function get_all_tags() {
  return await tagModel.find();
}

export async function add_Tags(new_tags) {
  return await tagModel.create(new_tags);
}

export async function edit_tags(old_tags, new_tags) {
  return await tagModel.findOneAndUpdate({ tag: old_tags }, new_tags);
}

export async function delete_tags(delete_tags) {
  return await tagModel.findOneAndDelete({
    tag: delete_tags,
  });
}

export const getTagsArray = async (tags) => {
  return await tagModel.find(
    {
      tag: { $in: tags },
    },
    { _id: 1 },
  );
};
