import express from 'express';
import Task from '../models/Task.js';
import { protect, admin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { title, description, dueDate, project, assignee } = req.body;
      logger.info(`Task creation attempt: ${title} for project: ${project} by user ID: ${req.user.id}`);
      const taskData = { title, description, project };
      if (dueDate) taskData.dueDate = dueDate;
      if (assignee) taskData.assignee = assignee;
      
      const task = new Task(taskData);
      const createdTask = await task.save();
      logger.info(`Task created successfully: ${createdTask.title} (ID: ${createdTask._id})`);
      res.status(201).json(createdTask);
    } catch (error) {
      logger.error(`Task creation error: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      logger.debug(`Fetching tasks for user ID: ${req.user.id} (${req.user.role})`);
      let tasks;
      if (req.user.role === 'Admin') {
        tasks = await Task.find({}).populate('project', 'name').populate('assignee', 'name email');
      } else {
        tasks = await Task.find({ assignee: req.user.id }).populate('project', 'name').populate('assignee', 'name email');
      }
      res.json(tasks);
    } catch (error) {
      logger.error(`Error fetching tasks: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const { status, title, description, dueDate, assignee } = req.body;
      logger.info(`Task update attempt: ${req.params.id} by user ID: ${req.user.id}`);
      const task = await Task.findById(req.params.id);
      
      if (task) {
        if (req.user.role === 'Admin') {
            task.title = title || task.title;
            task.description = description || task.description;
            task.dueDate = dueDate || task.dueDate;
            task.assignee = assignee || task.assignee;
        }
        task.status = status || task.status;
        
        const updatedTask = await task.save();
        logger.info(`Task updated successfully: ${updatedTask.title} (ID: ${updatedTask._id}, Status: ${updatedTask.status})`);
        res.json(updatedTask);
      } else {
        logger.warn(`Task not found for update: ${req.params.id}`);
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      logger.error(`Error updating task ${req.params.id}: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

router.route('/project/:projectId')
  .get(protect, async (req, res) => {
    try {
      logger.debug(`Fetching tasks for project ID: ${req.params.projectId}`);
      const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
      res.json(tasks);
    } catch (error) {
      logger.error(`Error fetching tasks for project ${req.params.projectId}: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

export default router;
