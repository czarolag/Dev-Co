const User = require("../models/User");
const cloudinary = require("../middleware/cloudinary");

// extract publicId from url
const getCloudinaryPublicId = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname; 
    const pathSegments = pathname.split("/");

    const uploadIndex = pathSegments.findIndex(seg => seg === "upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= pathSegments.length) return null;

    const relativePath = pathSegments.slice(uploadIndex + 1).join("/");
    const withoutVersion = relativePath.replace(/^v\d+\//, ""); 
    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); 

    return publicId;
  } catch (err) {
    console.warn("Failed to extract Cloudinary public_id from URL:", url);
    return null;
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle avatar upload
    if (req.file && req.file.buffer) {
      // Delete old avatar from Cloudinary
      if (user.avatar) {
        const publicId = getCloudinaryPublicId(user.avatar);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("Failed to delete old avatar from Cloudinary:", err.message);
          }
        }
      }

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        public_id: `avatars/${userId}_${Date.now()}`,
        folder: "avatars",
        transformation: [
          { width: 300, height: 300, crop: "fill", gravity: "face", quality: "auto" },
        ],
        overwrite: true,
      });

      user.avatar = result.secure_url;
    }

    // Update profile fields
    if (bio !== undefined) user.bio = bio;

    await user.save();

    // Return updated user 
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



const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "projects",
      public_id: `project_${Date.now()}`,
      transformation: [{ width: 800, crop: "limit", quality: "auto" }],
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};


module.exports = { updateProfile, uploadProjectImage };
