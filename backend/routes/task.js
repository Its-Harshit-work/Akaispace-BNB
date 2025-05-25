const express = require("express");

const { isLogin } = require("../middlewares/isLogin");
const {
  createTaskAndGeneratePresignedUrls,
  saveUploadedFiles,
  removeTaskandClearS3,
  getTasksWithStages,
  taskOverview,
  startPreLabel,
  getTasksByProjectID,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/get-tasks/:projectId", isLogin, getTasksByProjectID);

// ✅ Step 1: Create Task & Generate Presigned URLs
router.post("/create", isLogin, createTaskAndGeneratePresignedUrls);

// ✅ Step 2: Save Uploaded Files (Called After Upload to S3)
router.post("/upload-complete", isLogin, saveUploadedFiles);
router.post("/delete", isLogin, removeTaskandClearS3);

router.get("/progress/:projectId", isLogin, getTasksWithStages);

//Overview of tasks
router.get("/overview/:projectId", isLogin, taskOverview);

router.post("/start-prelabel", isLogin, startPreLabel);

module.exports = router;
