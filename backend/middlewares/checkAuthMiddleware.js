const jwt = require("jsonwebtoken");

const checkAuthStatus = (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(200).json({ status: false }); // No tokens, deny access
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      return res.status(200).json({ status: true }); // Valid access token, allow access
    }

    // Access token expired or invalid, check refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      (refreshErr, refreshDecoded) => {
        if (refreshErr) {
          return res.status(200).json({ status: false }); // Both tokens invalid, deny access
        }

        // Refresh token is valid, generate a new access token
        const newAccessToken = jwt.sign(
          { id: refreshDecoded.id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set the new access token as a cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          domain:
            process.env.NODE_ENV === "production" ? "akaispace.xyz" : undefined,
          maxAge: 60 * 60 * 1000, // 1 hour
        });
        return res.status(200).json({ status: true }); // Allow access with refreshed token
      }
    );
  });
};

module.exports = { checkAuthStatus };
