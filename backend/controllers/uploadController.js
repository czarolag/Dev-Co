const User = require("../models/User");
const { cloudinary } = require("../middleware/cloudinary");

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
};

const updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId; // Extracted from JWT payload
  
      const { name, bio } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Handle avatar upload
      if (req.file?.path) {
        if (user.avatar) {
          const publicId = getPublicIdFromUrl(user.avatar);
          try {
            await cloudinary.uploader.destroy(`avatars/${publicId}`);
          } catch (err) {
            console.warn("Failed to delete old avatar from Cloudinary:", err.message);
          }
        }
  
        user.avatar = req.file.path; // New Cloudinary URL
      }
  
      // Only update fields if values are explicitly provided
      if (name !== undefined) user.name = name;
      if (bio !== undefined) user.bio = bio;
  
      await user.save();
  
      // Refetch full user document after save to ensure it's complete
      const updatedUser = await User.findById(user._id).select("-password");
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Server error updating profile" });
    }
  };
  
  module.exports = { updateProfile };