const multer = require("multer");
const upload = require("../utils/multer");

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    console.log("✅ Uploaded File:", req.audio); // Log full file details
    req.secureUrl = req.file.path;
    next();
  });
};

module.exports = { handleUpload };
