// const express = require('express');
// const router = express.Router();
// const Message = require('../models/Message');

// router.post('/', async (req, res) => {
//   const { name, email, subject, message } = req.body;

//   try {
//     const newMessage = await Message.create({ name, email, subject, message });
//     res.status(201).json({ message: 'Message sent successfully', data: newMessage });
//   } catch (error) {
//     console.error('Contact Form Error:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/contact — Save a new contact form message
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET /api/contact — Fetch all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(messages);
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;
