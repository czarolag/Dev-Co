const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary"); 

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Upload avatar to Cloudinary 
    if (req.file && req.file.buffer) {
      // delete old avatar
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`avatars/${publicId}`);
        } catch (err) {
          console.warn("Failed to delete old avatar:", err.message);
        }
      }

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // auto format image to avatar size
      const result = await cloudinary.uploader.upload(base64, {
        folder: "avatars",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face", quality: "auto" },
        ],
      });

      user.avatar = result.secure_url;
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile };