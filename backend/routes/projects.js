import express from 'express';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { name, description, members } = req.body;
      logger.info(`Project creation attempt: ${name} by user ID: ${req.user.id}`);
      const project = new Project({ name, description, members });
      const createdProject = await project.save();
      logger.info(`Project created successfully: ${createdProject.name} (ID: ${createdProject._id})`);
      logger.info("Project added successfully");
      res.status(201).json(createdProject);
    } catch (error) {
      logger.error('Project creation error:', error);
      logger.error("Project not added successfully");
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      logger.debug(`Fetching projects for user ID: ${req.user.id} (${req.user.role})`);
      let projects;
      if (req.user.role === 'Admin') {
        projects = await Project.find({}).populate('members', 'name email');
      } else {
        projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
      }
      res.json(projects);
    } catch (error) {
      logger.error(`Error fetching projects: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      logger.debug(`Fetching project ID: ${req.params.id}`);
      const project = await Project.findById(req.params.id).populate('members', 'name email');
      if (project) {
        res.json(project);
      } else {
        logger.warn(`Project not found: ${req.params.id}`);
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      logger.error(`Error fetching project ${req.params.id}: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, admin, async (req, res) => {
    try {
      const { name, description, members } = req.body;
      logger.info(`Project update attempt: ${req.params.id} by user ID: ${req.user.id}`);
      const project = await Project.findById(req.params.id);
      if (project) {
        project.name = name || project.name;
        project.description = description || project.description;
        project.members = members || project.members;
        const updatedProject = await project.save();
        logger.info(`Project updated successfully: ${updatedProject.name} (ID: ${updatedProject._id})`);
        res.json(updatedProject);
      } else {
        logger.warn(`Project not found for update: ${req.params.id}`);
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      logger.error(`Error updating project ${req.params.id}: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

export default router;
