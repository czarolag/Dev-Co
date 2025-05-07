const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { uploadProjectImage } = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const {
      img,
      title,
      author,
      description,
      tags,
      url,
      collaboration,
    } = req.body;

    // Validate required fields
    if (!img || !title || !author || !description) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newProject = new Project({
      img,
      title,
      author,
      description,
      tags: Array.isArray(tags) ? tags : [],
      url,
      collaboration: collaboration || 'open',
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/projects/upload — Upload image to Cloudinary
router.post('/upload', upload.single('file'), uploadProjectImage);

module.exports = router;
