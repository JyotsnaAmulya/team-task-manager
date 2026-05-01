import express from 'express';
import Task from '../models/Task.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { title, description, dueDate, project, assignee } = req.body;
      const taskData = { title, description, project };
      if (dueDate) taskData.dueDate = dueDate;
      if (assignee) taskData.assignee = assignee;
      
      const task = new Task(taskData);
      const createdTask = await task.save();
      res.status(201).json(createdTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      let tasks;
      if (req.user.role === 'Admin') {
        tasks = await Task.find({}).populate('project', 'name').populate('assignee', 'name email');
      } else {
        tasks = await Task.find({ assignee: req.user.id }).populate('project', 'name').populate('assignee', 'name email');
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const { status, title, description, dueDate, assignee } = req.body;
      const task = await Task.findById(req.params.id);
      
      if (task) {
        // Only Admin can update fields other than status, but keep it simple for now
        if (req.user.role === 'Admin') {
            task.title = title || task.title;
            task.description = description || task.description;
            task.dueDate = dueDate || task.dueDate;
            task.assignee = assignee || task.assignee;
        }
        task.status = status || task.status;
        
        const updatedTask = await task.save();
        res.json(updatedTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/project/:projectId')
  .get(protect, async (req, res) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
