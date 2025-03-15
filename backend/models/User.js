const mongoose = require("mongoose");

// https://dev.to/aneeqakhan/create-user-model-3cfb
// https://dev.to/aneeqakhan/building-secure-user-authentication-in-nodejs-4cjj
const UserSchema = new mongoose.Schema(
    {
        username: {
        type: String,
        required: [true, "Enter username"],
    },
    email: {
        type: String, 
        required: [true, "Enter email"], 
        unique: true
    },
    password: {
        type :String, 
        required: [true, "Enter password"],
    },
},
 {
    collection: "users", 
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);