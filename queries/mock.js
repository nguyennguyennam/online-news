import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import categoryModel from "../model/category.model.js";
import postModel from "../model/post.model.js";
import tagModel from "../model/tag.model.js";
import userModel from "../model/user.model.js";
import { insertCategories } from "./categories.query.js";

export async function mockUsers() {
  const names = faker.helpers.uniqueArray(faker.person.fullName, 5);
  const dobs = faker.helpers.uniqueArray(faker.date.birthdate, 5);
  const emails = faker.helpers.uniqueArray(faker.internet.email, 5);
  const passwords = faker.helpers.uniqueArray(faker.internet.password, 5);
  const clearances = [1, 1, 2, 3, 4];

  await userModel.insertMany(
    [...Array(5)].map((_, idx) => ({
      fullName: names[idx],
      dob: dobs[idx],
      email: emails[idx],
      password: bcrypt.hashSync(passwords[idx], 12),
      clearance: clearances[idx],
    })),
  );
}

export async function mockCategories() {
  const categories = faker.helpers.uniqueArray(faker.book.genre, 50);
  await insertCategories(null, ...categories.slice(0, 10));
  for (let i = 0; i < 10; i++) {
    await insertCategories(
      categories[i],
      ...categories.slice(10 + i * 4, 10 + i * 4 + 4),
    );
  }
}

export async function mockTags() {
  const tags = faker.helpers.uniqueArray(faker.word.noun, 50);
  await tagModel.insertMany(tags.map((tag) => ({ tag })));
}

async function randomCategory() {
  const randomSample = await categoryModel
    .aggregate()
    .match({ parent: { $ne: null } })
    .sample(1);
  return randomSample[0]._id;
}

async function randomTags(count) {
  return (await tagModel.aggregate().sample(count)).map((tag) => tag._id);
}

export async function mockPosts() {
  const writer = await userModel.findOne({ clearance: 2 });
  const editor = await userModel.findOne({ clearance: 3 });

  const names = faker.helpers.uniqueArray(() => faker.lorem.words(5), 50);
  const writtenDates = faker.helpers.multiple(faker.date.past, { count: 50 });
  const publishedDates = faker.helpers.multiple(faker.date.past, { count: 50 });
  const smallThumbnails = faker.helpers.multiple(
    () => faker.image.url({ width: 400, height: 300 }),
    { count: 50 },
  );
  const largeThumbnails = faker.helpers.multiple(
    () => faker.image.url({ width: 1200, height: 800 }),
    { count: 50 },
  );
  const abstracts = faker.helpers.multiple(() => faker.lorem.sentences(3), {
    count: 50,
  });
  const views = faker.helpers.multiple(() => faker.number.int(10000), {
    count: 50,
  });
  const contents = faker.helpers.multiple(() => faker.lorem.paragraphs(10), {
    count: 50,
  });

  const posts = [...Array(50)].map(async (_, idx) => {
    return {
      writer: writer._id,
      editor: editor._id,
      name: names[idx],
      writtenDate: writtenDates[idx],
      publishedDate: publishedDates[idx],
      state: "published",
      thumbnail: {
        small: smallThumbnails[idx],
        large: largeThumbnails[idx],
      },
      abstract: abstracts[idx],
      views: views[idx],
      content: contents[idx],
      category: await randomCategory(),
      tags: await randomTags(2),
    };
  });
  Promise.all(posts).then(async (posts) => await postModel.insertMany(posts));
}
