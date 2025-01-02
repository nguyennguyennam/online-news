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

/**
 * Checks if a tag is taken.
 * @param {string} tag
 * @returns {Promise<boolean>}
 */
export async function hasTag(tag) {
  return (await tagModel.find({ tag })).length > 0;
}

/**
 * Creates a new tag.
 *
 * @param {string} tag
 */
export async function addTag(tag) {
  return await tagModel.create({ tag });
}

/**
 * Edits a tag with a new name.
 *
 * @param {string} tagId
 * @param {string} newName
 * @returns
 */
export async function editTag(tagId, newName) {
  return await tagModel.findOneAndUpdate(
    { _id: tagId },
    { tag: newName },
    { new: true },
  );
}

/**
 * Delete a tag.
 *
 * @param {string} tagId
 */
export async function deleteTag(tagId) {
  return await tagModel.findOneAndDelete({
    _id: tagId,
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
