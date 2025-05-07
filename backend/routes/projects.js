const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { uploadProjectImage } = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const mongoose = require("mongoose");

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});


// POST /api/projects
router.post('/', auth, async (req, res) => {
  try {
    const { img, title, description, tags, url, collaboration } = req.body;
    const userId = req.user.userId;

    if (!img || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const newProject = new Project({
      img,
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      url,
      collaboration: collaboration || 'open',
      author: userId,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

// POST /api/projects/upload — Upload image to Cloudinary
router.post('/upload', upload.single('file'), uploadProjectImage);


module.exports = router;
