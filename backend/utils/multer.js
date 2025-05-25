const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mp3_uploads",
    resource_type: "auto",
    allowed_formats: ["mp3", "m4a", "wav"], // Ensure these formats are allowed
  },
});

// ✅ Fix: Accept more audio formats in fileFilter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("Uploaded File Type:", file.mimetype); // Debugging log
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/m4a",
      "audio/x-m4a",
      "audio/wave",
      "audio/x-wav",
      "audio/aac",
      "audio/ogg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only MP3, M4A, WAV, AAC, and OGG files are allowed."
        ),
        false
      );
    }
  },
}).single("audio"); // 👈 Ensure Postman field name is "audio"

module.exports = upload;
