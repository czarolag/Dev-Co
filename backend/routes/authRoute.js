const express = require("express");
const { signup, login, getProfile, signout } = require("../controllers/userController");
const router = express.Router();


// User Signup, Login
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/signout", signout)


module.exports = router;