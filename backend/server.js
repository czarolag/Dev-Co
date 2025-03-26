require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/userRoutes");


// Middleware
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors({
  credentials: true,
}));

app.use(express.json()); // Parse JSON data

// connect to MongoDB
// https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/#environment-setup
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("Error connecting to MongoDB:", err));


// Routes        
app.use("/api/users", userRoutes);


// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});