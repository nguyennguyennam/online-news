/*
This module involves retrieving/sending files to S3 storage.
*/

import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { s3 } from "./db.js";

/**
 * Attempts to post an image on S3.
 *
 * @param {string} poster the one who posted the image
 * @param {any} image the image blob
 * @param {string} mime the file type
 * @returns {Promise<string>} the link to the image
 */
export async function postImage(poster, image, mime) {
  let itemName = crypto.randomBytes(16).toString("hex");

  // Keep checking if that key is used (tiny chance, just to be sure.)
  while (true) {
    try {
      const key = `${poster}/${itemName}`;
      const cmd = new HeadObjectCommand({ Bucket: "online-news", Key: key });
      await s3.send(cmd);

      // It exists rip
      itemName = crypto.randomBytes(16).toString("hex");
    } catch (err) {
      // Yay! It doesn't!
      break;
    }
  }

  const cmd = new PutObjectCommand({
    Body: image,
    Bucket: "online-news",
    Key: `${poster}/${itemName}`,
    ContentType: mime,
  });
  await s3.send(cmd);
  return `${process.env.S3_PERM}/${poster}/${itemName}`;
}
