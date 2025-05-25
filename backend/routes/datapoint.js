const express = require("express");
const {
  addLabelToDatapoint,
  updateDataPoint,
  deleteDataPoint,
  getDataPoints,
  getDatapointsOfTask,
  addPreLabelToDataPoint,
  addFinalLabelToDataPoint,
  datapointsOverview,
  getDatapointsOfTaskAnalytics,
  getDatapointById,
  getDatapointsOfProject,
} = require("../controllers/datapointController");
const { handleUpload } = require("../middlewares/uploadAudio");
const { isLogin } = require("../middlewares/isLogin");

const router = express.Router();

//Final
router.post("/add", addLabelToDatapoint);
router.post("/add-prelabel", addPreLabelToDataPoint);
router.post("/add-finallabel", addFinalLabelToDataPoint);
router.get(
  "/get-datapoints-project/:projectId",
  isLogin,
  getDatapointsOfProject
);

router.post("/get", isLogin, getDatapointById);

router.get(
  "/get-datapoints-task/:taskId",
  isLogin,
  getDatapointsOfTaskAnalytics
);

router.get("/get-datapoints/:taskId", isLogin, getDatapointsOfTask);

//UnFinal
router.get("/", getDataPoints);
router.put("/:id", isLogin, updateDataPoint);
router.delete("/:id", isLogin, deleteDataPoint);

//Overview
router.get("/overview/:projectId", isLogin, datapointsOverview);

//Export
// router.post("/export/with-videos", isLogin, expDatapointWithVideos);

module.exports = router;
