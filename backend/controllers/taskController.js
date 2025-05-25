const User = require("../models/user");
const Datapoint = require("../models/datapoint");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const mongoose = require("mongoose");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const axios = require("axios");

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const PRE_LABELS_API_URL = "http://13.200.172.58:8080/add_pre_labels/";

const calculateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

const getTasksByProjectID = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    // Find the project within a user's documents
    const project = await User.findOne(
      { "projects._id": projectId },
      { "projects.$": 1 }
    );

    if (!project) {
      return res.status(400).json({ message: "project not found" });
    }
    res.status(200).json({ tasks: project.projects[0].tasks });
  } catch (error) {
    console.error("Failed to add instruction", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const createTaskAndGeneratePresignedUrls = async (req, res) => {
  try {
    const { projectId, size, startOn, creditsNeeded, fileNames } = req.body;

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return res
        .status(400)
        .json({ message: "fileNames should be a non-empty array." });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const project = user.projects.find((d) => d._id.toString() === projectId);
    if (!project)
      return res.status(404).json({ message: "project not found." });

    // Generate unique task ID
    const taskId = new mongoose.Types.ObjectId();

    // Create task without files (files will be added later)
    const newTask = { _id: taskId, size, startOn };
    project.tasks.push(newTask);
    await user.save();

    // Generate presigned URLs
    const urls = await Promise.all(
      fileNames.map(async (fileName) => {
        const fileKey = `uploads/${projectId}/${taskId}/${fileName}`;
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
          ContentType: "image/jpeg",
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return { fileName, fileKey, url };
      })
    );

    res.status(201).json({
      message: "Task created and presigned URLs generated.",
      taskId,
      projectId,
      urls, // Client uses these URLs to upload files directly
    });
  } catch (error) {
    console.error("Error creating task and generating presigned URLs:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const removeTaskandClearS3 = async (req, res) => {
  try {
    const { projectId, taskId, uploadedFiles } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const project = user.projects.find((d) => d._id.toString() === projectId);
    if (!project)
      return res.status(404).json({ message: "project not found." });

    const task = project.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const taskIndex = project.tasks.findIndex(
      (t) => t._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    //Remove Task from project
    project.tasks.splice(taskIndex, 1);
    await user.save();

    //Clear files from S3 bucket
    deleteS3Files(uploadedFiles, projectId, taskId);

    res.status(200).json({ message: "Task Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting task.", error });
  }
};

const deleteS3Files = async (uploadedFiles, projectId, taskId) => {
  const objectsToDelete = uploadedFiles.map((file) => ({
    Key: `uploads/${projectId}/${taskId}/${file.fileName}`,
  }));

  if (objectsToDelete.length === 0) {
    console.log("No files to delete.");
    return;
  }

  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: objectsToDelete,
    },
  };

  try {
    await s3.send(new DeleteObjectsCommand(deleteParams));
  } catch (err) {
    console.error("Error deleting files:", err);
    throw err;
  }
};

const saveUploadedFiles = async (req, res) => {
  try {
    const { projectId, taskId, uploadedFiles } = req.body;

    if (!Array.isArray(uploadedFiles) || uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "uploadedFiles should be a non-empty array." });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const project = user.projects.find((d) => d._id.toString() === projectId);
    if (!project)
      return res.status(404).json({ message: "project not found." });

    const task = project.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const taskIndex = project.tasks.findIndex(
      (t) => t._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    const invalidFiles = [];

    for (const uploadedFile of uploadedFiles) {
      const { fileName, size, hash } = uploadedFile;

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${projectId}/${taskId}/${fileName}`,
      };

      const command = new GetObjectCommand(s3Params);

      const s3Response = await s3.send(command);

      const buffer = await streamToBuffer(s3Response.Body);

      const uploadedHash = calculateFileHash(buffer);

      if (uploadedHash !== hash || buffer.length !== size) {
        invalidFiles.push(fileName);
      }
    }

    if (invalidFiles.length > 0) {
      //Remove Task from project
      project.tasks.splice(taskIndex, 1);
      await user.save();

      //Clear files from S3 bucket
      deleteS3Files(uploadedFiles, projectId, taskId);

      return res
        .status(400)
        .json({ message: "Invalid files detected", invalidFiles });
    } else {
      console.log("Creating datapoints");
      // Create datapoints with the uploaded file URLs
      const newDataPoints = uploadedFiles.map((file) => ({
        mediaUrl: file.fileUrl,
        project_id: projectId,
        task_id: taskId,
        gameMapping: "default",
      }));

      await Datapoint.insertMany(newDataPoints);

      user.credits = user.credits - uploadedFiles.length;
      await user.save();

      return res.status(200).json({ message: "Files validated and saved." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error saving files.", error });
  }
};

const getTasksWithStages = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    // Find the project within a user's documents
    const project = await User.findOne(
      { "projects._id": projectId },
      { "projects.$": 1 }
    );

    if (!project) {
      return res.status(400).json({ message: "project not found" });
    }

    // Prepare tasks with stage and progress information
    const tasksWithStages = await Promise.all(
      project.projects[0].tasks.map(async (task) => {
        // Count total datapoints for this task
        const totalDatapoints = await Datapoint.countDocuments({
          project_id: projectId,
          task_id: task._id,
        });

        // Count pre-labeled datapoints (non-empty preLabel)
        const preLabeledDatapoints = await Datapoint.countDocuments({
          project_id: projectId,
          task_id: task._id,
          processingStatus: "pre-label",
        });

        // Count final-labeled datapoints (non-empty finalLabel)
        const finalLabeledDatapoints = await Datapoint.countDocuments({
          project_id: projectId,
          task_id: task._id,
          processingStatus: "live-label",
        });

        // Determine task stage and progress
        let progress = 0;
        if (
          preLabeledDatapoints === totalDatapoints &&
          finalLabeledDatapoints > 0
        ) {
          progress = (finalLabeledDatapoints / totalDatapoints) * 100;
        } else {
          progress = (preLabeledDatapoints / totalDatapoints) * 100;
        }

        // Calculate duration since start
        const startOn = task.startOn;
        const durationInHours = startOn
          ? Math.floor((new Date() - new Date(startOn)) / (1000 * 60 * 60))
          : 0;

        // Convert startOn to IST
        const istStartOn = startOn
          ? new Date(startOn).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          : null;

        return {
          taskId: task._id,
          size: totalDatapoints,
          stage: task.processingStatus,
          progress: progress,
          startOn: istStartOn,
          duration: durationInHours,
        };
      })
    );

    res.status(200).json({ success: true, tasksWithStages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const taskOverview = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "project ID not provided!" });

    const project = await User.findOne(
      { "projects._id": projectId },
      { "projects.$": 1 }
    );

    if (!project) {
      return res.status(400).json({ message: "project not found" });
    }
    const tasks = project.projects[0].tasks;

    const onGoingTasks = tasks.filter(
      (tk) => tk.processingStatus !== "completed"
    );

    const completedtasks = tasks.filter(
      (tk) => tk.processingStatus === "completed"
    );

    return res.status(200).json({
      success: true,
      data: {
        totalTasks: tasks.length,
        onGoingTasks: onGoingTasks.length,
        completedTasks: completedtasks.length,
      },
    });
  } catch (error) {
    console.error("Went Wrong fetching Overview of Tasks", error);
    res.status(500).json({ success: false, error });
  }
};

const startPreLabel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, projectId } = req.body;

    try {
      await axios.put(PRE_LABELS_API_URL, {
        user_id: userId,
        project_id: projectId,
        task_id: taskId,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Pre-Label API Failed",
        error: err.message,
      });
    }

    // First update the task's processingStatus if it's "created"
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        "projects._id": projectId,
        "projects.tasks._id": taskId,
        "projects.tasks.processingStatus": "created",
      },
      {
        $set: {
          "projects.$.tasks.$[task].processingStatus": "pre-label",
          "projects.$.progress": true,
        },
      },
      {
        arrayFilters: [{ "task._id": taskId }],
        new: true,
      }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "Task not found or already in progress" });
    }

    res.status(200).json({
      message: "Pre-label process started successfully",
      user,
    });
  } catch (error) {
    console.error("Failed to start Pre Label Process", error);
    return res
      .status(500)
      .json({ message: "Failed to start Pre Label Process", error });
  }
};

module.exports = {
  getTasksByProjectID,
  createTaskAndGeneratePresignedUrls,
  saveUploadedFiles,
  removeTaskandClearS3,
  getTasksWithStages,
  taskOverview,
  startPreLabel,
};
