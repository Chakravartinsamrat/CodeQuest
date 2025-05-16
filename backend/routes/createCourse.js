const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// POST /api/courses
router.post('/', async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;

    const newCourse = new Course({
      title,
      description, // should be an array of challenge ObjectIds
      createdBy: createdBy || 'Game Master'
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
