const User = require("../models/User");

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

module.exports = { signup, login };