const Datapoint = require("../models/datapoint");
const mongoose = require("mongoose");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const archiver = require("archiver");

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Add Label to Datapoint (Embedded inside Datapoint)
const addLabelToDatapoint = async (req, res) => {
  try {
    const { userId, description, rating, audioUrl, datapointId } = req.body;

    if (!userId || !description || !rating || !datapointId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Find the existing datapoint
    const datapoint = await Datapoint.findById(datapointId);
    if (!datapoint) {
      return res.status(404).json({ message: "Datapoint not found" });
    }

    // const mediaUrl = req.secureUrl;
    // if (!mediaUrl) {
    //   return res.status(400).json({ message: "No secure URL found" });
    // }

    // Create a new label and append it inside the datapoint
    const newLabel = { userId, description, rating, audioUrl };
    datapoint.labels.push(newLabel); // Add label inside `labels` array

    await datapoint.save();

    return res.status(200).json({
      success: true,
      message: "Label added successfully to the datapoint",
      label: newLabel,
      updatedDatapoint: datapoint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDatapointById = async (req, res) => {
  try {
    const { datapointIds } = req.body;

    if (
      !datapointIds ||
      !Array.isArray(datapointIds) ||
      datapointIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid datapoint IDs array is required" });
    }
    const datapoints = await Datapoint.find({
      _id: { $in: datapointIds },
    });
    if (!datapoints || datapoints.length === 0) {
      return res.status(404).json({ message: "Datapoints not found" });
    }
    res.status(200).json(datapoints);
  } catch (error) {
    console.error("Error fetching datapoints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDataPoints = async (req, res) => {
  try {
    const { projectId } = req.body;

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    // Convert string ID to Mongoose ObjectId
    const objectId = new mongoose.Types.ObjectId(projectId);

    // Find all datapoints with matching project_id
    const datapoints = await Datapoint.find({ project_id: objectId });

    if (datapoints.length === 0) {
      return res
        .status(404)
        .json({ message: "No datapoints found for this project" });
    }

    res.status(200).json(datapoints);
  } catch (error) {
    console.error("Error fetching datapoints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Datapoints by Project ID (For Analytics)
const getDatapointsOfProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const dataPoints = await Datapoint.find({ project_id: projectId });

    if (dataPoints.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No datapoints found" });
    }

    const dataPointsWithFinalLabel = dataPoints.filter(
      (datapoint) => datapoint.finalLabel && datapoint.finalLabel.trim() !== ""
    );

    const finalLabeledPercent =
      (dataPointsWithFinalLabel.length / dataPoints.length) * 100;

    res.status(200).json({
      success: true,
      totalLength: dataPoints.length,
      finalLength: dataPointsWithFinalLabel.length,
      percent: finalLabeledPercent,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

// Get Datapoints by Task ID (For Analytics)
const getDatapointsOfTaskAnalytics = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const dataPoints = await Datapoint.find({ task_id: taskId });

    if (dataPoints.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No datapoints found" });
    }

    const dataPointsWithFinalLabel = dataPoints.filter(
      (datapoint) => datapoint.finalLabel && datapoint.finalLabel.trim() !== ""
    );

    const finalLabeledPercent =
      (dataPointsWithFinalLabel.length / dataPoints.length) * 100;

    res.status(200).json({
      success: true,
      totalLength: dataPoints.length,
      finalLength: dataPointsWithFinalLabel.length,
      percent: finalLabeledPercent,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getDatapointsOfTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const dataPoints = await Datapoint.find({ task_id: taskId });

    if (dataPoints.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No datapoints found" });
    }
    res.status(200).json({ datapoints: dataPoints });
  } catch (error) {
    console.error("Failed to get Datapoints", error);
    return res.status(500).json({ success: false, error: error });
  }
};

// Update Datapoint
const updateDataPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDataPoint = await Datapoint.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedDataPoint) {
      return res.status(404).json({ message: "DataPoint not found." });
    }

    res.status(200).json({
      message: "DataPoint updated successfully",
      dataPoint: updatedDataPoint,
    });
  } catch (error) {
    console.error("Error updating DataPoint:", error);
    res.status(500).json({ message: "Failed to update DataPoint", error });
  }
};

// Delete Datapoint
const deleteDataPoint = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDataPoint = await Datapoint.findByIdAndDelete(id);
    if (!deletedDataPoint) {
      return res.status(404).json({ message: "DataPoint not found." });
    }

    res.status(200).json({ message: "DataPoint deleted successfully" });
  } catch (error) {
    console.error("Error deleting DataPoint:", error);
    res.status(500).json({ message: "Failed to delete DataPoint", error });
  }
};

// Add PreLabel to Datapoint
const addPreLabelToDataPoint = async (req, res) => {
  try {
    const { datapointId, preLabel } = req.body;

    // Find the datapoint directly since it's now in its own collection
    const datapoint = await Datapoint.findById(datapointId);
    if (!datapoint) {
      return res.status(404).json({
        success: false,
        message: "Datapoint not found",
      });
    }

    // Find the user that owns the project
    const user = await User.findOne({
      "projects._id": datapoint.project_id,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User or project not found",
      });
    }

    // Find the specific project
    const project = user.projects.find(
      (ds) => ds._id.toString() === datapoint.project_id.toString()
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "project not found",
      });
    }

    // Update the pre-label in the Datapoint collection
    await Datapoint.findByIdAndUpdate(datapointId, {
      preLabel: preLabel,
    });

    // Update the preLabelList in the project
    const currentTime = new Date();
    let windowEndTime = new Date(project.preLabelWindow);
    const interval = 12 * 60 * 60 * 1000; // 12hrs in millisec

    let timeDifference = currentTime - windowEndTime;
    let intervalCount = Math.floor(timeDifference / interval);

    if (timeDifference < 0) {
      // If still within current window, increment last entry
      if (project.preLabelList.length === 0) {
        project.preLabelList.push(1); // First entry
      } else {
        project.preLabelList[project.preLabelList.length - 1] += 1;
      }
    } else {
      // Add zeros for passed intervals and add 1 for current update
      for (let i = 0; i < intervalCount; i++) {
        project.preLabelList.push(0);
      }
      project.preLabelList.push(1);

      // Update window end timestamp
      project.preLabelWindow = new Date(
        windowEndTime.getTime() + (intervalCount + 1) * interval
      );
    }

    // Save the updated user document to persist project changes
    await user.save();

    // Fetch the updated datapoint to return in response
    const updatedDatapoint = await Datapoint.findById(datapointId);

    res.status(200).json({
      success: true,
      message: "Pre-label updated successfully",
      data: {
        datapoint: updatedDatapoint,
        project: project,
      },
    });
  } catch (error) {
    console.error("Error in addPreLabelToDataPoint:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add FinalLabel to Datapoint
const addFinalLabelToDataPoint = async (req, res) => {
  try {
    const { datapointId, finalLabel } = req.body;

    // Find the datapoint directly from Datapoint collection
    const datapoint = await Datapoint.findById(datapointId);
    if (!datapoint) {
      return res.status(404).json({
        success: false,
        message: "Datapoint not found",
      });
    }

    // Find the user that owns the project
    const user = await User.findOne({
      "projects._id": datapoint.project_id,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User or project not found",
      });
    }

    // Find the specific project
    const project = user.projects.find(
      (ds) => ds._id.toString() === datapoint.project_id.toString()
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "project not found",
      });
    }

    // Update the final label in the Datapoint collection
    await Datapoint.findByIdAndUpdate(datapointId, {
      finalLabel: finalLabel,
    });

    // Update the finalLabelList in the project
    const currentTime = new Date();
    let windowEndTime = new Date(project.finalLabelWindow);
    const interval = 24 * 60 * 60 * 1000; // 12hrs in millisec

    let timeDifference = currentTime - windowEndTime;
    let intervalCount = Math.floor(timeDifference / interval);

    if (timeDifference < 0) {
      // If still within current window, increment last entry
      if (project.finalLabelList.length === 0) {
        project.finalLabelList.push(1); // First entry
      } else {
        project.finalLabelList[project.finalLabelList.length - 1] += 1;
      }
    } else {
      // Add zeros for passed intervals and add 1 for current update
      for (let i = 0; i < intervalCount; i++) {
        project.finalLabelList.push(0);
      }
      project.finalLabelList.push(1);

      // Update window end timestamp
      project.finalLabelWindow = new Date(
        windowEndTime.getTime() + (intervalCount + 1) * interval
      );
    }

    // Save the updated user document to persist project changes
    await user.save();

    // Fetch the updated datapoint to return in response
    const updatedDatapoint = await Datapoint.findById(datapointId);

    res.status(200).json({
      success: true,
      message: "Final label updated successfully",
      data: {
        datapoint: updatedDatapoint,
        project: project,
      },
    });
  } catch (error) {
    console.error("Error in addFinalLabelToDataPoint:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Save Uploaded Files (Create Multiple Datapoints)
const saveUploadedFiles = async (req, res) => {
  try {
    const { projectId, taskId, files } = req.body; // Array of { fileName, fileUrl }

    if (!Array.isArray(files) || files.length === 0) {
      return res
        .status(400)
        .json({ message: "Files should be a non-empty array." });
    }

    const newDataPoints = files.map((file) => ({
      mediaUrl: file.fileUrl,
      project_id: projectId,
      task_id: taskId,
      preLabel: "",
      finalLabel: "",
      labels: [], // No external label references anymore
      gameMapping: "default",
    }));

    await Datapoint.insertMany(newDataPoints);

    res
      .status(201)
      .json({ message: "Files saved successfully", newDataPoints });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ message: "Failed to save files", error });
  }
};

const datapointsOverview = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "project ID not provided!" });
    const datapoints = await Datapoint.find({
      project_id: projectId,
    });

    if (!datapoints || datapoints.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No datapoints found!" });
    }

    const onGoingDatapoints = datapoints.filter(
      (dp) => dp.processingStatus !== "completed"
    );

    const completedDatapoints = datapoints.filter(
      (dp) => dp.processingStatus === "completed"
    );

    return res.status(200).json({
      success: true,
      data: {
        totalDatapoints: datapoints.length,
        onGoingDatapoints: onGoingDatapoints.length,
        completedDatapoints: completedDatapoints.length,
      },
    });
  } catch (error) {
    console.error("Went Wrong fetching Overview of Datapoints", error);
    res.status(500).json({ success: false, error });
  }
};

const expDatapointWithVideos = async (req, res) => {
  try {
    const { datapoints } = req.body;
    if (!datapoints || !Array.isArray(datapoints)) {
      return res.status(400).json({ error: "Invalid datapoints provided" });
    }

    // Create temporary directories
    const tempDir = path.join(__dirname, "temp_export");
    const videosDir = path.join(tempDir, "Videos");
    const labelsDir = path.join(tempDir, "Labels");

    // Ensure directories exist
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
    if (!fs.existsSync(labelsDir)) fs.mkdirSync(labelsDir);

    const downloadPromises = datapoints.map(async (datapoint) => {
      const videoName = `${datapoint.mediaUrl.split("/")[6]}.mp4`;
      const labelName = `${datapoint.mediaUrl.split("/")[6]}.json`;

      // Download video from S3
      const videoPath = path.join(videosDir, videoName);
      await downloadFromS3(datapoint.mediaUrl, videoPath);

      // Create label JSON file
      const labelData = {
        preLabel: datapoint.preLabel || null,
        finalLabel: datapoint.finalLabel || null,
      };

      const labelPath = path.join(labelsDir, labelName);
      fs.writeFileSync(labelPath, JSON.stringify(labelData, null, 2));
    });

    await Promise.all(downloadPromises);

    // Create zip file
    const zipFileName = `datapoints_export_${Date.now()}.zip`;
    const zipFilePath = path.join(tempDir, zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`Archive created, ${archive.pointer()} total bytes`);

      // Send the zip file
      res.download(zipFilePath, zipFileName, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }

        // Clean up temporary files
        deleteFolderRecursive(tempDir);
      });
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(videosDir, "Videos");
    archive.directory(labelsDir, "Labels");
    archive.finalize();
  } catch (error) {
    console.error("Error exporting datapoints:", error);
    res.status(500).json({ error: "Failed to export datapoints" });
  }
};

async function downloadFromS3(s3Url, filePath) {
  try {
    console.log("S3 URL:", s3Url);
    console.log("File Path:", filePath);

    // Extract the key from the URL
    const key = decodeURI(s3Url.split("/").slice(3).join("/"));
    console.log("Extracted Key:", key);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    console.log("S3 Params:", params);

    const command = new GetObjectCommand(params);
    console.log("Command created");

    const s3Response = await s3.send(command);
    console.log("S3 Response received");

    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      s3Response.Body.pipe(file)
        .on("error", (err) => {
          console.error("Error writing file:", err);
          reject(err);
        })
        .on("finish", () => {
          console.log("File downloaded successfully");
          resolve();
        });
    });
  } catch (error) {
    console.error("Error in downloadFromS3:", error);
    throw error;
  }
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
const test = async (req, res) => {
  try {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/68171957b8b2b19f6e7025fb/681c827e301ae43636a590b7/006_20250114_sora [MConverter.eu].mp4`,
    };

    const command = new GetObjectCommand(s3Params);
    const s3Response = await s3.send(command);

    const buffer = await streamToBuffer(s3Response.Body);

    console.log(buffer);
    res.status(200).json({ buffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to export datapoints" });
  }
};

module.exports = {
  addLabelToDatapoint,
  getDataPoints,
  updateDataPoint,
  deleteDataPoint,
  getDatapointsOfProject,
  getDatapointsOfTaskAnalytics,
  getDatapointsOfTask,
  addPreLabelToDataPoint,
  addFinalLabelToDataPoint,
  saveUploadedFiles,
  datapointsOverview,
  // expDatapointWithVideos,
  test,
  getDatapointById,
};
