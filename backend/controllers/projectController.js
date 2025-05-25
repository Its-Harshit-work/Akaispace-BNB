const User = require("../models/user");
const Datapoint = require("../models/datapoint");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  S3ServiceException,
} = require("@aws-sdk/client-s3");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { readFile } = require("node:fs/promises");
const dotenv = require("dotenv");

dotenv.config();

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create Project inside User
const createProject = async (req, res) => {
  try {
    const { name, type, tags } = req.body; //add category
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check if project with same name exists
    if (user.projects.some((project) => project.name === name)) {
      return res.status(400).json({ message: "Project name already exists." });
    }

    // Add project inside user
    const newProject = { name, type, tasks: [], tags };
    user.projects.push(newProject);
    await user.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project", error });
  }
};

// Get all projects for the user
const getProjectsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ projects: user.projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

const getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const projectID = req.params.projectId;

    const project = user.projects.filter((project) => project.id === projectID);
    if (!project)
      return res
        .status(400)
        .json({ message: "Wrong combination of userID and projectID" });

    res.status(200).json({ project: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project", error });
  }
};

const getAnalyticsData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    // Get project details including preLabelList and finalLabelList
    const projectDetails = await User.aggregate([
      { $unwind: "$projects" },
      {
        $match: {
          "projects._id": projectObjectId,
        },
      },
      {
        $project: {
          _id: 0,
          projectName: "$projects.name",
          preLabelList: "$projects.preLabelList",
          finalLabelList: "$projects.finalLabelList",
          tasks: "$projects.tasks",
        },
      },
    ]);

    if (!projectDetails.length) {
      return res.status(404).json({ message: "project not found" });
    }

    // Get datapoints statistics
    const datapointStats = await Datapoint.aggregate([
      {
        $match: {
          project_id: projectObjectId,
        },
      },
      {
        $group: {
          _id: null,
          totalDatapoints: { $sum: 1 },
          finalLabeledDatapoints: {
            $sum: {
              $cond: [
                {
                  $and: [{ $ne: ["$finalLabel", ""] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalDatapoints: 1,
          finalLabeledDatapoints: 1,
          finalLabeledPercentage: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$totalDatapoints", 0] },
                  0,
                  { $divide: ["$finalLabeledDatapoints", "$totalDatapoints"] },
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    // Format the percentage as an integer using Math.round()
    if (datapointStats.length) {
      datapointStats[0].finalLabeledPercentage = Math.round(
        datapointStats[0].finalLabeledPercentage
      );
    }

    // Get task-wise datapoint statistics
    const project = projectDetails[0];
    const taskStats = await Promise.all(
      project.tasks.map(async (task) => {
        const taskDatapointStats = await Datapoint.aggregate([
          {
            $match: {
              task_id: task._id,
              project_id: projectObjectId,
            },
          },
          {
            $group: {
              _id: null,
              totalDatapoints: { $sum: 1 },
              datapointsFinalLabeled: {
                $sum: {
                  $cond: [
                    {
                      $and: [{ $ne: ["$finalLabel", ""] }],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalDatapoints: 1,
              datapointsFinalLabeled: 1,
              percentageFinalLabeled: {
                $multiply: [
                  {
                    $cond: [
                      { $eq: ["$totalDatapoints", 0] },
                      0,
                      {
                        $divide: [
                          "$datapointsFinalLabeled",
                          "$totalDatapoints",
                        ],
                      },
                    ],
                  },
                  100,
                ],
              },
            },
          },
        ]);

        const stats = taskDatapointStats[0] || {
          totalDatapoints: 0,
          datapointsFinalLabeled: 0,
          percentageFinalLabeled: 0,
        };

        return {
          taskId: task._id,
          totalDatapoints: stats.totalDatapoints,
          datapointsFinalLabeled: stats.datapointsFinalLabeled,
          percentageFinalLabeled: Math.round(stats.percentageFinalLabeled),
        };
      })
    );

    // Combine all statistics
    const response = {
      projectName: project.projectName,
      preLabelList: project.preLabelList || [],
      finalLabelList: project.finalLabelList || [],
      datapointStats: datapointStats[0] || {
        totalDatapoints: 0,
        finalLabeledDatapoints: 0,
        finalLabeledPercentage: 0,
      },
      taskStats,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in project analytics:", error);
    res.status(500).json({
      message: "Error fetching project analytics",
      error: error.message,
    });
  }
};

const addInstruction = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { label, markdown } = req.body;

    let videoPath = req.filePath;
    const fileName = req.fileName;

    videoPath = `../${videoPath}`;

    if (!videoPath) {
      return res
        .status(400)
        .json({ success: false, message: "Upload Middleware Failed!" });
    }

    if (!projectId || !label || !markdown) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient Payload Data!" });
    }

    const fileKey = `uploads/${projectId}/instruction/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: await readFile(videoPath),
    });

    await s3.send(command);

    // Find the user that contains the project
    const user = await User.findOne({ "projects._id": projectId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }

    const project = user.projects.id(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }

    const video_url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Set instruction
    project.instruction = {
      video_url,
      label,
      markdown,
    };

    // Save the user document with updated project
    await user.save();

    fs.rmSync(videoPath);

    res.status(200).json({
      success: true,
      message: "Instruction added successfully",
    });
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to bucket. \
The object was too large.`
      );
    } else if (error instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to bucket.  ${error.name}: ${error.message}`
      );
    } else {
      console.error("Failed to add instruction", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

const expDatapoints = async (req, res) => {
  try {
    const { datapoints } = req.body;

    if (!datapoints || !Array.isArray(datapoints)) {
      return res.status(400).json({ error: "Invalid datapoints provided" });
    }

    // Create temporary directories
    const tempDir = path.join("/tmp", "export");
    const labelsDir = path.join(tempDir, "Labels");

    // Ensure directories exist
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (!fs.existsSync(labelsDir)) fs.mkdirSync(labelsDir);

    await Promise.all(
      datapoints.map(async (datapoint) => {
        const labelName = `${datapoint.mediaUrl.split("/")[6]}.json`;

        // Create label file
        const labelPath = path.join(labelsDir, labelName);
        fs.writeFileSync(
          labelPath,
          JSON.stringify(
            {
              preLabel: datapoint.preLabel || null,
              finalLabel: datapoint.finalLabel || null,
            },
            null,
            2
          )
        );
      })
    );

    // Create zip file
    const zipFileName = `datapoints_export_${Date.now()}.zip`;
    const zipFilePath = path.join(tempDir, zipFileName);

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("finish", () => {
        // Set headers
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${zipFileName}`
        );

        // Stream the file
        const fileStream = fs.createReadStream(zipFilePath);
        fileStream.pipe(res);

        fileStream.on("end", () => {
          fs.rmSync(tempDir, {
            recursive: true,
            force: true,
          });
          resolve();
        });
      });

      archive.on("warning", (err) => {
        console.warn("Archive warning:", err);
        if (err.code === "ENOENT") {
          // Handle non-critical warnings
          return;
        }
        reject(err);
      });

      archive.on("error", (err) => {
        console.error("Archive error:", err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(labelsDir, "Labels");
      archive.finalize();
    });
  } catch (error) {
    console.error("Error exporting datapoints:", error);
    // Clean up temp directory if it exists
    if (fs.existsSync(path.join("/tmp", "export"))) {
      fs.rmSync(path.join("/tmp", "export"), {
        recursive: true,
        force: true,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to export datapoints", details: error.message });
  }
};

const expDatapointWithVideos = async (req, res) => {
  try {
    const { datapointIds } = req.body;
    if (!datapointIds || !Array.isArray(datapointIds)) {
      return res.status(400).json({ error: "Invalid datapoint IDs provided" });
    }

    const objectIds = datapointIds.map((id) => new ObjectId(id));

    const datapoints = await Datapoint.find({ _id: { $in: objectIds } });

    if (!datapoints || !Array.isArray(datapoints)) {
      return res.status(400).json({ error: "Invalid datapoints provided" });
    }

    // Create temporary directories
    const tempDir = path.join("/tmp", "export");
    const videosDir = path.join(tempDir, "Videos");
    const labelsDir = path.join(tempDir, "Labels");

    // Clean up any existing temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Ensure directories exist
    fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(videosDir, { recursive: true });
    fs.mkdirSync(labelsDir, { recursive: true });

    // Download all files
    await Promise.all(
      datapoints.map(async (datapoint) => {
        const videoName = `${datapoint.mediaUrl.split("/")[6]}.mp4`;
        const labelName = `${datapoint.mediaUrl.split("/")[6]}.json`;

        // Download video
        const videoPath = path.join(videosDir, videoName);

        await downloadFromS3(datapoint.mediaUrl, videoPath);
        // Create label file
        const labelPath = path.join(labelsDir, labelName);
        fs.writeFileSync(
          labelPath,
          JSON.stringify(
            {
              preLabel: datapoint.preLabel || null,
              finalLabel: datapoint.finalLabel || null,
            },
            null,
            2
          )
        );
      })
    );

    // Create zip file
    const zipFileName = `datapoints_export_${Date.now()}.zip`;

    // Send the response as a zip file
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${zipFileName}`,
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // Pipe archive data to the response
    archive.pipe(res);

    // Add the directories to the archive
    archive.directory(videosDir, "Videos");
    archive.directory(labelsDir, "Labels");

    // Finalize the archive
    await archive.finalize();

    // Clean up temp directory after sending
    setTimeout(() => {
      if (fs.existsSync(tempDir)) {
        // deleteFolderRecursive(tempDir);
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }, 1000);
  } catch (error) {
    console.error("Error exporting datapoints:", error);
    if (fs.existsSync(path.join("/tmp", "export"))) {
      fs.rmSync(path.join("/tmp", "export"), {
        recursive: true,
        force: true,
      });
    }
    res
      .status(500)
      .json({ error: "Failed to export datapoints", details: error.message });
  }
};

async function downloadFromS3(s3Url, filePath) {
  try {
    // Extract the key from the URL
    const key = decodeURI(s3Url.split("/").slice(3).join("/"));

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);

    const s3Response = await s3.send(command);

    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      s3Response.Body.pipe(file)
        .on("error", (err) => {
          console.error("Error writing file:", err);
          reject(err);
        })
        .on("finish", () => {
          resolve();
        });
    });
  } catch (error) {
    console.error("Error in downloadFromS3:", error);
    throw error;
  }
}

module.exports = {
  createProject,
  getProjectsForUser,
  getAnalyticsData,
  getProjectById,
  addInstruction,
  expDatapointWithVideos,
  expDatapoints,
};