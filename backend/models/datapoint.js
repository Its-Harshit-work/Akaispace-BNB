const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    audioUrl: { type: String, required: true },
  },
  { _id: false, timestamps: true } // Prevents separate _id creation for labels
);

const LabelDataSchema = new mongoose.Schema(
  {
    map_position: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

// Datapoint Schema (Main Collection)
const DatapointSchema = new mongoose.Schema(
  {
    processingStatus: {
      type: String,
      enum: ["created", "pre-label", "live-label", "consensus", "completed"],
      default: "created",
    },
    mediaUrl: { type: String, required: true },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    preLabel: {
      type: LabelDataSchema,
      default: null,
    },
    finalLabel: {
      type: String,
      default: "",
    },
    labels: {
      type: [LabelSchema],
      default: [],
    },
    gameMapping: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Datapoint", DatapointSchema, "datapoints");
