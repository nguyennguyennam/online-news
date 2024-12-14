import mongoose from "mongoose";

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
