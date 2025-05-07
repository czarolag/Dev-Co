const User = require("../models/User");
const Project = require("../models/Project")

// Signup function
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if user exists already
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already taken." });
            }

            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already registered." });
            }
        }

        // create new user instance
        const user = new User({ username, email, password });
        await user.save();
        const token = user.generateJWT();
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User logged in successfully", success: true, user });
    } catch (e) {
        console.error("Error in Signup", e);
        res.status(500).json({ message: "Error registering user" });
    }
};


// Login function
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // find user by username or email
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. User not found." });
        }

        // validate password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Wrong password." });
        }

        const token = user.generateJWT();
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(200).json({ message: "User logged in successfully", success: true, user });
    } catch (e) {
        console.error("Error in Login", e);
        res.status(500).json({ message: "Error logging in user" });
    }
}


// Get User Profile
const getProfile = async (req, res) => {
    try {
        // find user by
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (e) {
        console.error("Error fetching user: ", e);
        res.status(500).json({ message: "Server error" });
    }
};


const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select("_id username avatar bio");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user by username:", err);
        return res.status(500).json({ message: "Failed to load user profile" });
    }
};


// GET /api/users/projects/:userId
const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            author: req.params.userId,
          }).sort({ createdAt: -1 });
        return res.status(200).json(projects);
    } catch (err) {
        console.error("Project fetch error:", err);
        return res.status(500).json({ message: "Failed to fetch user projects" });
    }
};


// User Sign out
const signout = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ message: "Successfully signed out" });
}


module.exports = { signup, login, getProfile, signout, getUserByUsername, getUserProjects };