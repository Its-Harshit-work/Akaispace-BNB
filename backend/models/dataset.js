const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    datapoints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Datapoint",
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Dataset ||
  mongoose.model("Dataset", DatasetSchema, "datasets");
