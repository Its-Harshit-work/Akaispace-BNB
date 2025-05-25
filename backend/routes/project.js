const express = require("express");
const {
  getAnalyticsData,
  addInstruction,
  expDatapointWithVideos,
  expDatapoints,
  createProject,
  getProjectsForUser,
  getProjectById,
} = require("../controllers/projectController");
const { isLogin } = require("../middlewares/isLogin");
const { handleUploadVideo } = require("../middlewares/uploadMedia");

const router = express.Router();

router.post("/create", isLogin, createProject);
router.get("/", isLogin, getProjectsForUser);

router.post(
  "/add-instruction/:projectId",
  isLogin,
  handleUploadVideo,
  addInstruction
);

router.get("/:projectId", isLogin, getProjectById);

router.get("/project-analytics/:projectId", isLogin, getAnalyticsData);

//Export
router.post("/export/with-videos", isLogin, expDatapointWithVideos);
router.post("/export/without-videos", isLogin, expDatapoints);

module.exports = router;
