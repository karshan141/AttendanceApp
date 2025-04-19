const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Get attendance for a specific date
router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const attendance = await Attendance.find({ date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0)
    }}).populate('employeeId', 'name');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save attendance
router.post('/', async (req, res) => {
  const attendanceRecords = req.body.attendance; // Assuming req.body.attendance is an array

  try {
    const savedAttendance = await Attendance.insertMany(attendanceRecords);
    res.status(201).json(savedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;