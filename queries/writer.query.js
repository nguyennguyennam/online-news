import postModel from "../model/post.model";
import tagModel from "../model/tag.model";
import categoryModel from "../model/category.model";

export async function savePost(writerId, name, abstract, content, category, tags, premium) {
    return await postModel.create({
        writer: writerId,
        name: name,
        writtenDate: new Date(),
        abstract: abstract,
        content: content,
        category: category,
        tags: tags,
        premium: premium,
        status: "Draft",
    });
}

export async function post_Lists(writer_id) {
    return await postModel.aggregate([
        {writer : writer_id},
        { $sort: { writtenDate: -1 } },
        {
            $group: {
                _id: '$status',
                posts: { $push: '$$ROOT' }
            }
        }
    ])
}


export async function modified_post(id_post, name, abstract, content) {
    return await postModel.updateOne(

        {
            _id: id_post
        },
        {
            name: name,
            abstract: abstract,
            content: content
        })
} 