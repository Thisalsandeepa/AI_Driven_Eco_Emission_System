const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'admin@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin user already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email,
      password: hashedPassword,
      isAdmin: true  // Add this field in your User model schema if it doesn’t exist yet
    });

    console.log('Admin user created:', admin);
    process.exit();
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
