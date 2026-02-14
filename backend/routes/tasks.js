const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/tasks - list with filters: status, priority, search, sort, order
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sort = 'createdAt', order = 'desc' } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }
    const sortOpt = { [sort]: order === 'asc' ? 1 : -1 };
    const tasks = await Task.find(filter).sort(sortOpt).lean();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      status: ['Todo', 'In Progress', 'Completed'].includes(status) ? status : 'Todo',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create task' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch task' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description?.trim() || '';
    if (priority !== undefined && ['Low', 'Medium', 'High'].includes(priority)) task.priority = priority;
    if (status !== undefined && ['Todo', 'In Progress', 'Completed'].includes(status)) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Todo', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update status' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete task' });
  }
});

module.exports = router;
