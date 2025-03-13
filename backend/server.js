require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");

const app = express();


// Middleware
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors())
app.use(express.json()); // Parse JSON data

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("Error connecting to MongoDB:", err));


app.get('/', (req, res) => {
    res.send("Hello World!")
  })
  

  // Start Server
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })