require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quicktask';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Task.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    email: 'demo@quicktask.com',
    password: 'demo123',
    name: 'Demo User',
  });

  const now = new Date();
  const tasks = [
    { title: 'Review project brief', description: 'Go through requirements', priority: 'High', status: 'Completed', dueDate: new Date(now.getTime() - 86400000) },
    { title: 'Setup development environment', description: 'Install Node, MongoDB, Python', priority: 'High', status: 'Completed', dueDate: new Date(now.getTime() - 86400000) },
    { title: 'Implement backend API', description: 'Auth and task CRUD', priority: 'High', status: 'In Progress', dueDate: new Date(now.getTime() + 86400000) },
    { title: 'Build React frontend', description: 'Dashboard and task list', priority: 'Medium', status: 'Todo', dueDate: new Date(now.getTime() + 172800000) },
    { title: 'Add analytics service', description: 'Python Flask endpoints', priority: 'Medium', status: 'Todo', dueDate: new Date(now.getTime() + 259200000) },
  ];

  for (const t of tasks) {
    await Task.create({
      ...t,
      userId: user._id,
    });
  }

  console.log('Seed complete. Demo user: demo@quicktask.com / demo123');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
