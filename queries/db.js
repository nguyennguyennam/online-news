import { S3Client } from "@aws-sdk/client-s3";
import mongoose from "mongoose";

console.log(process.env.S3_CLIENT, process.env.S3_SECRET);
export const s3 = new S3Client({
  region: "eu2",
  endpoint: process.env.S3_HOST,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_CLIENT,
    secretAccessKey: process.env.S3_SECRET,
  },
});

export async function connect() {
  await mongoose.connect(process.env.MONGO_URL);
}

export async function disconnect() {
  await mongoose.disconnect();
}

process.on("SIGINT", async () => {
  await disconnect();
  console.log("Disconnected");
  process.exit(0);
});
