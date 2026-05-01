import express from 'express';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { name, description, members } = req.body;
      const project = new Project({ name, description, members });
      const createdProject = await project.save();
      res.status(201).json(createdProject);
    } catch (error) {
      console.error('Project creation error:', error);
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      let projects;
      if (req.user.role === 'Admin') {
        projects = await Project.find({}).populate('members', 'name email');
      } else {
        projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
      }
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('members', 'name email');
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, admin, async (req, res) => {
    try {
      const { name, description, members } = req.body;
      const project = await Project.findById(req.params.id);
      if (project) {
        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members || project.members;
        const updatedProject = await project.save();
        res.json(updatedProject);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
