const Dataset = require("../models/dataset");

const addDataset = async (req, res) => {
  try {
    const { name, description, license, project_id, datapoints } = req.body;
    const userId = req.user.id;
    if (
      !name ||
      !description ||
      !license ||
      !project_id ||
      !datapoints ||
      !userId
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    await Dataset.create({
      name,
      description,
      license,
      project_id,
      datapoints,
      user_id: userId,
    });

    res
      .status(200)
      .json({ message: "Dataset added to marketplace successfully!" });
  } catch (error) {
    console.error("Error adding dataset to marketplace: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDatasetsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Please provide user id" });
    }
    const datasets = await Dataset.find({ user_id: userId });

    res.status(200).json(datasets);
  } catch (error) {
    console.error("Error adding dataset to marketplace: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find();
    if (!datasets) {
      return res.status(400).json({ message: "No Datasets found !" });
    }
    res.status(200).json(datasets);
  } catch (error) {
    console.error("Error adding dataset to marketplace: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDatasetById = async (req, res) => {
  try {
    const datasetId = req.params.datasetId;
    if (!datasetId) {
      return res.status(400).json({ message: "Provide a Dataset ID!" });
    }
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(400).json({ message: "No Dataset found !" });
    }
    res.status(200).json(dataset);
  } catch (error) {
    console.error("Error adding dataset to marketplace: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addDataset,
  getDatasetsByUser,
  getDatasetById,
  getAllDatasets,
};
