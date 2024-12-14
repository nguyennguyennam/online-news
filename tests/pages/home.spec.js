import supertest from "supertest";
import { describe, it } from "vitest";
import app from "../../app";

describe("home page", () => {
  it("generates home page", async () => {
    const doc = document.documentElement;
    const res = await supertest(app).get("/").send();
  });
});
