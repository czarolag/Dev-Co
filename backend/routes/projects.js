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


router.post('/:projectId/request', auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // prevent duplicate requests
    if (
      project.pendingRequests.includes(userId) ||
      project.collaborators.includes(userId)
    ) {
      return res.status(400).json({ message: 'Already requested or collaborating' });
    }

    project.pendingRequests.push(userId);
    await project.save();

    res.status(200).json({ message: 'Collaboration request sent' });
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/:projectId/requests', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('pendingRequests', 'username avatar _id');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (String(project.author) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'Only the author can view requests' });
    }

    res.status(200).json({ pendingRequests: project.pendingRequests });
  } catch (err) {
    console.error('Failed to fetch pending requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:projectId/respond', auth, async (req, res) => {
  const { targetUserId, accept } = req.body;
  const authorId = req.user.userId;

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (String(project.author) !== String(authorId)) {
      return res.status(403).json({ message: 'Only the author can respond to requests' });
    }

    // remove from pending
    project.pendingRequests = project.pendingRequests.filter(
      id => String(id) !== String(targetUserId)
    );

    if (accept) {
      project.collaborators.push(targetUserId);
    }

    await project.save();
    res.status(200).json({ message: accept ? 'Accepted' : 'Rejected' });
  } catch (err) {
    console.error('Respond error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/projects/:id/dashboard
router.get('/:id/dashboard', auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    const project = await Project.findById(projectId)
      .populate('author', 'username')
      .populate('collaborators', 'username avatar');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAuthor = String(project.author._id) === String(userId);
    const isCollaborator = project.collaborators.some(
      (collaborator) => String(collaborator._id) === String(userId)
    );

    if (!isAuthor && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Return full dashboard data if authorized
    res.status(200).json({
      project,
      access: isAuthor ? "owner" : "collaborator",
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('update/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (String(project.author) !== String(userId)) {
      return res.status(403).json({ message: 'Only the author can update this project' });
    }

    const fieldsToUpdate = ['title', 'description', 'url', 'collaboration', 'tags'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('collaborators', 'username avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
