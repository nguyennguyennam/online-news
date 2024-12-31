import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import categoryModel from "../model/category.model.js";
import commentModel from "../model/comment.model.js";
import postModel from "../model/post.model.js";
import tagModel from "../model/tag.model.js";
import userModel from "../model/user.model.js";
import { insertCategories } from "./categories.query.js";

/**
 * Mock ups 20 users, with random clearance roles.
 */
export async function mockUsers() {
  const names = faker.helpers.uniqueArray(faker.person.fullName, 20);
  const dobs = faker.helpers.uniqueArray(faker.date.birthdate, 20);
  const emails = faker.helpers.uniqueArray(faker.internet.email, 20);
  const clearances = faker.helpers.multiple(
    () => faker.number.int({ min: 1, max: 4 }),
    { count: 20 },
  );

  await userModel.insertMany(
    [...Array(20)].map((_, idx) => ({
      fullName: names[idx],
      dob: dobs[idx],
      email: emails[idx],
      password: bcrypt.hashSync("1234", 12),
      clearance: clearances[idx],
    })),
  );
}

/**
 * Mocks up 10 categories.
 */
export async function mockCategories() {
  const categories = faker.helpers.uniqueArray(faker.word.noun, 50);
  await insertCategories(null, ...categories.slice(0, 10));
  for (let i = 0; i < 10; i++) {
    await insertCategories(
      categories[i],
      ...categories.slice(10 + i * 4, 10 + i * 4 + 4),
    );
  }
}

/**
 * Mocks up 100 tags.
 */
export async function mockTags() {
  const tags = faker.helpers.uniqueArray(faker.word.noun, 100);
  await tagModel.insertMany(tags.map((tag) => ({ tag })));
}

/**
 * Retrieves a random category.
 *
 * @returns {Promise<string>} a random category ID
 */
async function randomCategory() {
  const randomSample = await categoryModel.aggregate().sample(1);
  return randomSample[0]._id;
}

/**
 * Retrieves a number of random tag IDs.
 * @param {number} count
 * @returns {Promise<Array<string>>} a string of tag IDs.
 */
async function randomTags(count) {
  return (await tagModel.aggregate().sample(count)).map((tag) => tag._id);
}

/**
 * Returns a random writer's id.
 * @returns {Promise<string>} a writer's id
 */
async function randomWriter() {
  return (await userModel.aggregate().match({ clearance: 2 }).sample(1))[0]._id;
}

/**
 * Returns a random editor's id.
 * @returns {Promise<string>} an editor's id
 */
async function randomEditor() {
  return (await userModel.aggregate().match({ clearance: 3 }).sample(1))[0]._id;
}

/**
 * Mocks up 500 posts, with various settings.
 */
export async function mockPosts() {
  // Fake content data.
  const names = faker.helpers.uniqueArray(
    () => faker.lorem.words({ min: 4, max: 12 }),
    500,
  );
  const writtenDates = faker.helpers.multiple(faker.date.recent, {
    count: 500,
  });
  const publishedDates = faker.helpers.multiple(faker.date.recent, {
    count: 500,
  });
  const smallThumbnails = faker.helpers.multiple(
    () => faker.image.url({ width: 400, height: 300 }),
    { count: 500 },
  );
  const largeThumbnails = faker.helpers.multiple(
    () => faker.image.url({ width: 1200, height: 800 }),
    { count: 500 },
  );
  const abstracts = faker.helpers.multiple(
    () => faker.lorem.sentences({ min: 3, max: 6 }),
    {
      count: 500,
    },
  );
  const states = faker.helpers.multiple(
    () =>
      faker.helpers.arrayElement(["draft", "denied", "approved", "published"]),
    { count: 500 },
  );
  const views = faker.helpers.multiple(() => faker.number.int(10000), {
    count: 500,
  });
  const contents = faker.helpers.multiple(
    () => faker.lorem.paragraphs({ min: 20, max: 30 }),
    {
      count: 500,
    },
  );
  const premiums = faker.helpers.multiple(
    () => faker.datatype.boolean({ probability: 0.1 }),
    { count: 500 },
  );

  const posts = [...Array(500)].map(async (_, idx) => {
    return {
      writer: await randomWriter(),
      editor: states[idx] == "draft" ? null : await randomEditor(),
      name: names[idx],
      writtenDate: writtenDates[idx],
      publishedDate: publishedDates[idx],
      state: states[idx],
      thumbnail: {
        small: smallThumbnails[idx],
        large: largeThumbnails[idx],
      },
      abstract: abstracts[idx],
      views: views[idx],
      premium: premiums[idx],
      content: contents[idx],
      category: await randomCategory(),
      tags: await randomTags(2),
    };
  });
  await Promise.all(posts).then(
    async (posts) => await postModel.insertMany(posts),
  );
}

/**
 * Adds at least 5 comments to all 50 posts.
 */
export async function mockComments() {
  const posts = await postModel.find();
  const users = await userModel.find();

  await Promise.all(
    posts.map(async (post) => {
      const commenters = faker.helpers.arrayElements(users, {
        min: 5,
        max: 10,
      });
      const contents = faker.helpers.multiple(
        () => faker.lorem.sentences({ min: 1, max: 10 }),
        {
          count: commenters.length,
        },
      );
      const dates = faker.helpers.multiple(
        () => faker.date.recent({ days: 10 }),
        {
          count: commenters.length,
        },
      );

      await commentModel.insertMany(
        [...Array(commenters.length)].map((_, idx) => ({
          post: post._id,
          user: commenters[idx]._id,
          content: contents[idx],
          postedDate: dates[idx],
        })),
      );
    }),
  );
}

export async function unmockAll() {
  await Promise.all([
    userModel.deleteMany(),
    categoryModel.deleteMany(),
    postModel.deleteMany(),
    commentModel.deleteMany(),
  ]);
}
