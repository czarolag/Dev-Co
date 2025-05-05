const express = require("express");
const { signup, login, getProfile, signout } = require("../controllers/userController");
const { updateProfile } = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();


// User Signup, Login
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.post("/signout", signout)

// update profile
router.put("/profile", auth, upload.single("avatar"), updateProfile);


module.exports = router;