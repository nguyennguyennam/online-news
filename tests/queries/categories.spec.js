import { faker } from "@faker-js/faker";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import categoryModel from "../../model/category.model";
import { getAllCategories } from "../../queries/categories.query";

describe("random test", async () => {
  let mongoDb;

  beforeAll(async () => {
    mongoDb = await MongoMemoryServer.create();
    await mongoose.connect(mongoDb.getUri());

    const fakeCats = faker.helpers.uniqueArray(faker.book.genre, 8);
    const parentCats = await categoryModel.insertMany(
      fakeCats.slice(0, 3).map((s) => ({ name: s })),
    );
    await categoryModel.insertMany(
      fakeCats.slice(3).map((s) => ({
        name: s,
        parent: faker.helpers.arrayElement(parentCats)._id,
      })),
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoDb.stop();
  });

  it("retrieves all correctly", async () => {
    const categories = await getAllCategories();
    expect(categories.length).toBe(3);
    expect(categories[0]).toHaveProperty("name");
  });
});
