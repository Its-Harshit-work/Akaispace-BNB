const User = require("../models/user");
const { sendEmail } = require("../utils/emailService");
const { appendToExcel } = require("../utils/excelService");
// const { appendToGoogleSheet } = require('./utils/googleSheetsService');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Register a New User
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!role || !["user", "enterprise"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either 'user' or 'enterprise'." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt: expiresAt,
      role,
      projects: [], // Ensure new users start with an empty projects array
    });

    await newUser.save();

    await sendEmail(
      email,
      "OTP for Registration",
      `Hello ${username},\n\nWelcome to Akai Space.\nYour OTP for registration is: ${otp}\n\nThank you!`
    );

    res.status(201).json({
      message: "User registered successfully. Check your email for OTP.",
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res
      .status(500)
      .json({ message: "Error occurred while registering.", error });
  }
};

// Resend OTP to User
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(newOtp, 10);
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Update OTP in user schema
    user.otp = hashedOtp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    // Send the new OTP via email
    await sendEmail(
      email,
      "Resend OTP - Akai Space",
      `Hello ${user.username},\n\nYour new OTP for verification is: ${newOtp}\n\nThis OTP is valid for 5 minutes.\n\nThank you!`
    );

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.error("Error occurred while resending OTP:", error);
    res.status(500).json({ message: "Failed to resend OTP.", error });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || (typeof otp !== "string" && typeof otp !== "number")) {
      return res
        .status(400)
        .json({ message: "OTP must be a valid number or string." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    if (!user.otp || Date.now() > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error occurred while verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Error occurred while verifying OTP.", error });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "User not found or not verified." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Generate access token (expires in 1 hour)
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "15d" } // for now I am setting the expiry for 15 days
    );

    // Refresh--> HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in production with HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: "Error occurred during login.", error });
  }
};

//Refresh token

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized. No refresh token provided." });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token." });

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain:
          process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token.", error });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-otp -password");
    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while fetching user" + error });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).select("-otp -password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit Enterprise Form
const submitEnterpriseForm = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      jobTitle,
      workEmail,
      projectBudget,
      descriptionForm,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !jobTitle ||
      !workEmail ||
      !projectBudget ||
      !descriptionForm
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail)) {
      return res.status(400).json({ message: "Invalid work email format." });
    }

    if (isNaN(projectBudget) || Number(projectBudget) <= 0) {
      return res
        .status(400)
        .json({ message: "Project budget must be a positive number." });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "enterprise") {
      return res
        .status(403)
        .json({ message: "Only enterprises can submit this form." });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.companyName = companyName;
    user.jobTitle = jobTitle;
    user.workEmail = workEmail;
    user.projectBudget = projectBudget;
    user.descriptionForm = descriptionForm;

    await user.save();

    const userEmail = req.user.email;

    // await appendToGoogleSheet([
    //   {
    //     UserEmail: userEmail,
    //     Date: new Date().toISOString(),
    //     FirstName: firstName,
    //     LastName: lastName,
    //     CompanyName: companyName,
    //     JobTitle: jobTitle,
    //     WorkEmail: workEmail,
    //     ProjectBudget: projectBudget,
    //     Description: descriptionForm,
    //   },
    // ]);

    await appendToExcel("enterprise_responses.xlsx", [
      {
        UserEmail: userEmail,
        Date: new Date().toISOString(),
        FirstName: firstName,
        LastName: lastName,
        CompanyName: companyName,
        JobTitle: jobTitle,
        WorkEmail: workEmail,
        ProjectBudget: projectBudget,
        Description: descriptionForm,
      },
    ]);

    res
      .status(200)
      .json({ message: "Form submitted successfully and saved to Excel." });
  } catch (error) {
    console.error("Error occurred while submitting the form:", error);
    res
      .status(500)
      .json({ message: "Error occurred while submitting the form.", error });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.refreshToken = null;
    await user.save();

    // Clear cookies with the SAME options used when setting them
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
    });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while logging out.", error });
  }
};

module.exports = {
  register,
  resendOtp,
  verifyOTP,
  login,
  logout,
  submitEnterpriseForm,
  getUser,
  getUserById,
  refreshToken,
};
