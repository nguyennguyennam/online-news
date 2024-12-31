import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { getAllCategories } from "../queries/categories.query.js";
import { getCommentsForPost } from "../queries/comments.query.js";
import { postImage } from "../queries/image.query.js";
import {
  createPost,
  getPost,
  getRelatedPosts,
  increaseView,
} from "../queries/posts.query.js";
import { canViewPremium, getClearanceLevel } from "../queries/users.query.js";

/**
 * GET /post: Displays the WYSIWYG editor. (?)
 *
 * - Clearance Level: 2 (Writer)
 * - Object Class: Safe
 * - Special Containment Procedures: None
 * - Addendum:
 *   + 200/OK: renders pages/writer.ejs
 *   + 401/Unauthorized: renders pages/401.ejs
 */
export const getPostHandler = expressAsyncHandler(async (req, res) => {
  const categories = await getAllCategories();

  if (!req.session.userInfo) {
    res.render("layouts/main-layout", {
      title: "Unauthorized",
      description: "You are not authorized to view that resource.",
      content: "../pages/401",
      categories,
    });
    return;
  }

  const clearance = await getClearanceLevel(req.session.userInfo.id);
  if (clearance < 2) {
    res.render("layouts/main-layout", {
      title: "Unauthorized",
      description: "You are not authorized to view that resource.",
      content: "../pages/401",
      userInfo: req.session?.userInfo,
      categories,
    });
    return;
  }

  res.render("layouts/main-layout", {
    title: "Write a post",
    description: "A text editor for writing a post.",
    content: "../pages/create-post",
    userInfo: req.session?.userInfo,
    categories: null,
    availCategories: categories.flatMap((n) =>
      n.children.map((c) => ({ ...c, name: `${n.name} / ${c.name}` })),
    ),
    tinymce: true,
  });
});

/**
 * POST /post: Endpoint for posting a new article.
 *
 * - Clearance Level: 2 (Writer)
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Mutates the S3 storage.
 *   + Mutates the collection posts.
 */
export const postPostHandler = expressAsyncHandler(async (req, res) => {
  if (
    !req.session.userInfo ||
    (await getClearanceLevel(req.session.userInfo.id)) < 2
  ) {
    res.redirect("/");
    return;
  }

  const categories = await getAllCategories();
  const largeThumbnail = req.files["thumbnail-large"][0];
  const smallThumbnail = req.files["thumbnail-small"][0];
  const schema = z.object({
    name: z.string(),
    summary: z.string(),
    content: z.string(),
    category: z.string(),
    tags: z.string(),
    premium: z.coerce.boolean().default(false),
  });
  const body = schema.safeParse(req.body);

  if (body.error) {
    res.redirect("/post");
    return;
  }

  const id = req.session.userInfo.id;
  const [largeUrl, smallUrl] = await Promise.all([
    postImage(id, largeThumbnail.buffer, largeThumbnail.mimetype),
    postImage(id, smallThumbnail.buffer, smallThumbnail.mimetype),
  ]);

  const post = await createPost({
    writer: id,
    name: body.data.name,
    abstract: body.data.summary,
    thumbnail: {
      large: largeUrl,
      small: smallUrl,
    },
    category: body.data.category,
    tags: body.data.tags,
    content: body.data.content,
    premium: body.data.premium,
  });
  res.redirect(`/posts`);
});

/**
 * POST /post/image: Endpoint for posting an image.
 *
 * - Clearance Level: 2 (Writer)
 * - Object Class: Euclid
 * - Special Containment Procedures:
 *   + Accepts a file jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp under 10MB.
 *   + Mutates the S3 storage.
 * - Addendum:
 *   + 200/OK: Returns {location: string} being the link to the uploaded image.
 *   + 401/Unauthorized: Not enough clearance level.
 */
export const postImageHandler = expressAsyncHandler(async (req, res) => {
  if (
    !req.session.userInfo ||
    (await getClearanceLevel(req.session.userInfo.id)) < 2
  ) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Only accept what TinyMCE specifies as an image.
  // image/jpeg: includes .jpeg, .jpg, .jfi, .jpe, .jfif, .jif
  // image/gif: includes .gif
  // image/png: includes .png
  // image/webp: includes .webp
  // image/bmp: includes .bmp
  const acceptables = [
    "image/jpeg",
    "image/gif",
    "image/png",
    "image/webp",
    "image/bmp",
  ];

  // TinyMCE should already filter this out. But never trust user's input.
  // They could have sent a POST with Postman or CURL.
  if (!acceptables.includes(req.files.file.mimetype)) {
    res
      .status(400)
      .json({ message: "This only accepts jpeg, gif, png, webp and bmp." });
    return;
  }

  const link = await postImage(
    req.session.userInfo.id,
    req.files.file.data,
    req.files.file.mimetype,
  );
  return res.status(200).json({ location: link });
});

/**
 * GET /post/:id: Displays a post, 5 related posts and comments.
 *
 * - Clearance Level: 0 (Anyone)
 * - Object Class: Safe
 * - Special Containment Procedures:
 *   + Accepts parameters { id: ObjectId }.
 * - Addendum:
 *   + 200/OK: renders pages/article
 *   + 401/Unauthorized: renders pages/401
 *   + 404/NotFound: renders pages/404
 */
export const getPostIdHandler = expressAsyncHandler(async (req, res) => {
  const [post, categories] = await Promise.all([
    getPost(req.params.id),
    getAllCategories(),
  ]);
  const [comments, related] = await Promise.all([
    getCommentsForPost(post._id),
    getRelatedPosts(post._id),
  ]);

  // 404 if not found.
  if (post == null) {
    res.render("layouts/main-layout", {
      title: "Page not found",
      description:
        "Landing page for when the requested resource could not be found.",
      content: "../pages/404",
      categories,
      userInfo: req.session?.userInfo,
    });
    return;
  }

  // 401 if post is premium and clearance level <= 1 and no subscription.
  if (post.premium) {
    const userInfo = req.session.userInfo;
    if (!userInfo || !(await canViewPremium(userInfo.id))) {
      res.render("layouts/main-layout", {
        title: "Unauthorized",
        description: "You are not authorized to view that resource.",
        content: "../pages/401",
        categories,
        userInfo: req.session?.userInfo,
      });
      return;
    }
  }

  await increaseView(post._id);

  // 200 and show if everything passed.
  res.render("layouts/main-layout", {
    title: post.name,
    description: post.abstract,
    content: "../pages/article",
    categories,
    comments,
    related,
    post,
    userInfo: req.session?.userInfo,
  });
});
