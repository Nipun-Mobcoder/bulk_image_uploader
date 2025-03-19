import "dotenv/config";
import Queue from "bull";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import client from "./client.js";
import { Readable } from "stream";

const uploadQueue = new Queue("imageUploadQueue", {
  redis: client,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

uploadQueue.process(10, async (job) => {
  const { buffer, originalName } = job.data;
  const stream = Readable.from(Buffer.from(buffer.data));

  try {
    const uploadPromise = new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          folder: "bulk_upload",
          public_id: `${randomUUID()}-${originalName}`,
        },
        (error, result) => {
          if (error) return reject(error);
          console.log(`Image uploaded successfully at ${result.secure_url}`);
          resolve(result.secure_url);
        }
      );

      stream.pipe(cloudinaryStream);
    });

    return uploadPromise;
  } catch (e) {
    console.error(e);
    throw new Error("Cloudinary upload failed");
  }
});

uploadQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed successfully at url: ${result}`);
});

uploadQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed error: ${error.message}`);
});

console.log("Listening for jobs.");
