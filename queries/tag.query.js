import tagModel from "../model/tag.model";
export async function get_all_tags () {
    return await tagModel.find();
}

export async function add_Tags (new_tags) {
    return await tagModel.create(new_tags);
}

export async function edit_tags (old_tags, new_tags) {
    return await tagModel.findOneAndUpdate(
        {tag : old_tags},
        new_tags
    )
}

export async function delete_tags (delete_tags) {
    return await tagModel.findOneAndDelete({
        tag: delete_tags
    })
}