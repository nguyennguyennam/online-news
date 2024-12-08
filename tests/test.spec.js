import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, it } from "vitest";
import { Category } from "../model/category.model";
import { getAllCategories } from "../queries/categories.query";

describe("random test", async () => {
  let mongoDb;

  beforeAll(async () => {
    mongoDb = await MongoMemoryServer.create();
    await mongoose.connect(mongoDb.getUri());

    const res = await Category.insertMany([
      { name: "Education" },
      { name: "Business" },
      { name: "Gaming" },
    ]);
    await Category.insertMany([
      { name: "High School", parent: res[0]._id },
      { name: "University", parent: res[0]._id },
      { name: "Agriculture", parent: res[1]._id },
      { name: "Finance", parent: res[1]._id },
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoDb.stop();
  });

  it("tests", async () => {
    console.dir(await getAllCategories(), { depth: null });
  });
});
