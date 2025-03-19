import express from "express";
import "dotenv/config";
import multer from "multer";
import Queue from "bull";
import client from "./client.js";

const app = express();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadQueue = new Queue("imageUploadQueue", {
  redis: client,
});

app.post("/upload", upload.array("images", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ error: "No file uploaded." });
    }
    await Promise.all(
      req.files.map((file) =>
        uploadQueue.add({
          buffer: file.buffer,
          originalName: file.originalname,
        })
      )
    );

    res.status(200).send({
      message: "Images are being uploaded.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: "Looks like something went wrong.",
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
