const mongoose = require("mongoose");

// Task Schema (Embedded inside Project)
const TaskSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true }, // Total size of all files
    startOn: { type: Date, required: true },
    endOn: { type: Date, required: false },
    processingStatus: {
      type: String,
      enum: ["created", "pre-label", "live-label", "completed"],
      default: "created",
    },
  },
  { _id: true, timestamps: true } // _id: false prevents auto-generating _id for subdocuments
);

const InstructionSchema = new mongoose.Schema(
  {
    video_url: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// Project Schema (Embedded inside User)
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    tasks: [TaskSchema], // Directly embed tasks instead of referencing
    progress: { type: Boolean, required: true, default: false },
    preLabelList: { type: [Number], required: false },
    finalLabelList: { type: [Number], required: false },
    tags: {
      type: [String],
      required: false,
    },
    instruction: InstructionSchema,
    preLabelWindow: {
      type: Date,
      default: () => new Date(Date.now() + 12 * 60 * 60 * 1000),
      required: true,
    },
    finalLabelWindow: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

// User Schema (Main Collection)
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    // BNB 
    walletAddress: { type: String, required: true, unique: true },  // BNB
    createdAt: { type: Date, default: Date.now }, // Timestamp for account creation
    credits: { type: Number, default: 300 }, // Default credits for new users
    projects: [ProjectSchema], // Embed proejcts directly
    role: { type: String, enum: ["user", "enterprise"], required: true },
    hasFilledForm: {
      type: Boolean,
      default: false,
    },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", UserSchema, "users");
module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");
