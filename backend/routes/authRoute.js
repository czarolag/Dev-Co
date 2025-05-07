const express = require("express");
const { signup, login, getProfile, signout, getUserByUsername, getUserProjects } = require("../controllers/userController");
const { updateProfile, uploadProjectImage } = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();



// User Signup, Login
router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("avatar"), updateProfile);

router.get("/username/:username", getUserByUsername);
router.post("/", upload.single("file"), uploadProjectImage);
router.get("/:userId/projects", getUserProjects);


module.exports = router;