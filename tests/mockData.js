import { faker } from "@faker-js/faker";
import { insertCategories } from "../queries/categories.query";

export async function fakeCategories() {
  const catNames = faker.helpers.uniqueArray(faker.book.genre, 30);
  await insertCategories(null, ...catNames.slice(0, 10));
}



