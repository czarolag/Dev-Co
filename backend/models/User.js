const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


// https://dev.to/aneeqakhan/create-user-model-3cfb
// https://dev.to/aneeqakhan/building-secure-user-authentication-in-nodejs-4cjj
const UserSchema = new mongoose.Schema(
    {
        username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
    },
    password: {
        type: String, 
        required: true,
    },
},
 {
    collection: "userAuth", 
    timestamps: true,
});


// pre-save hook for password hashing
// https://medium.com/@finnkumar6/mastering-user-authentication-building-a-secure-user-schema-with-mongoose-and-bcrypt-539b9394e5d9
UserSchema.pre("save", async function(next) {
    try {
        // check if password has been modified
        if (!this.isModified("password")) return next();

        // generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next(); // proceed to save
    } catch (e) {
        next(e); // pass errors to middleware
    }
});


// Compare entered password with hashed password
UserSchema.methods.isValidPassword = async function(password) {
    try {
        // Compare provided password with stored hash
        return await bcrypt.compare(password, this.password);
    } catch (e) {
        throw new Error("Password comparison failed");
    }
};


// Generate JWT token for user
UserSchema.methods.generateJWT = function() {
    return jwt.sign({ userId: this._id }, JWT_SECRET, { expiresIn: "1h" }); 
}

module.exports = mongoose.model("User", UserSchema);