const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mpeg",
  ];
  
  const validateFileType = (req, res, next) => {
    const { files } = req.body;
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type detected." });
      }
    }
    next();
  };
  
  module.exports = validateFileType;
  