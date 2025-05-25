const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isLogin = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        return next(); // Access token is valid, proceed to the next middleware or route
      } catch (err) {
        // If access token is expired, attempt to refresh it
        if (err.name !== "TokenExpiredError") {
          return res.status(403).json({ message: "Invalid access token." });
        }
      }
    }

    // Refresh the access token using the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Session expired. Please login again." });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
          return res
            .status(403)
            .json({ message: "Invalid refresh token. Please login again." });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
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

        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
        next(); // Proceed to the next middleware or route
      }
    );
  } catch (error) {
    console.error("Error in isLogin middleware:", error);
    res.status(500).json({ message: "Middleware: Internal server error." });
  }
};

module.exports = { isLogin };