import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";

export async function mockUsers() {
  const names = faker.helpers.uniqueArray(faker.person.fullName, 5);
  const dobs = faker.helpers.uniqueArray(faker.date.birthdate, 5);
  const emails = faker.helpers.uniqueArray(faker.internet.email, 5);
  const passwords = faker.helpers.uniqueArray(faker.internet.password, 5);
  const clearances = [1, 1, 2, 3, 4];

  console.log(passwords);

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
