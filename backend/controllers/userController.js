const User = require("../models/User");

// Signup function
const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
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
        res.status(201).json({ token });
    } catch (e) {
        console.error("Error in Signup", e);
        res.status(500).json({ message: "Error registering user" });
    }
};

module.exports = { signup };