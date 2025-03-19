# Image Upload Service with Bull and Cloudinary

This project is a bulk image upload service using **Express**, **Multer**, **Bull Queue**, and **Cloudinary**. It processes image uploads using Redis-backed job queues for efficient handling of multiple images.

## Features
- **Multer** for handling file uploads.
- **Bull Queue** for asynchronous job processing.
- **Cloudinary** for cloud storage of images.
- **Redis** for managing the queue.
- **Docker support** (if Redis is not installed locally).

---

## Installation

### 1️⃣ Clone the Repository
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file in the root directory and add:
```env
PORT=4000
CLOUD_NAME=<your_cloudinary_cloud_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
REDIS_HOST=<your_redis_host>
REDIS_PORT=<your_redis_port>
REDIS_PASSWORD=<your_redis_password>
```

> **Note:** Replace `<your_values>` with actual credentials.

---

## Running the Project

### 🚀 Start the Server
Run the following command:
```sh
npm start
```
This will start both the queue processor and the Express server.

If Redis is not running, you can start it with Docker:
```sh
docker run --name redis -p 6379:6379 -d redis
```

---

## API Endpoints

### 1️⃣ Upload Images (POST /upload)
- **URL:** `http://localhost:4000/upload`
- **Method:** `POST`
- **Body:** Form-Data with multiple image files (max 20)
- **Field Name:** `images`

#### Example Request using cURL:
```sh
curl -X POST http://localhost:4000/upload \
  -F "images=@path/to/image1.jpg" \
  -F "images=@path/to/image2.jpg"
```

#### Example Response:
```json
{
  "message": "Images are being uploaded."
}
```

---

## Folder Structure
```
├── client.js             # Redis connection
├── queueProcessor.js     # Image upload queue processing
├── index.js              # Express server
├── .env                  # Environment variables
├── package.json          # Node.js dependencies
└── README.md             # Project documentation
```

---

