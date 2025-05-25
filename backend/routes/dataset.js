const express = require("express");
const { isLogin } = require("../middlewares/isLogin");
const {
  getDatasetsByUser,
  getDatasetById,
  getAllDatasets,
  addDataset,
} = require("../controllers/datasetController");

const router = express.Router();

router.post("/add", isLogin, addDataset);
router.get("/get-by-user", isLogin, getDatasetsByUser);
router.get("/get-all", isLogin, getAllDatasets);
router.get("/get-by-id/:datasetId", isLogin, getDatasetById);

module.exports = router;
