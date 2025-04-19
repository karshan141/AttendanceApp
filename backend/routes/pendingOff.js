const express = require('express');
const router = express.Router();
const PendingOff = require('../models/pendingOff');

// Get all pending offs for an employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const pendingOffs = await PendingOff.find({ employeeId: req.params.employeeId }).populate('employeeId', 'name');
    res.json(pendingOffs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new pending off request
router.post('/', async (req, res) => {
  const pendingOff = new PendingOff({
    employeeId: req.body.employeeId,
    offDate: req.body.offDate,
  });

  try {
    const newPendingOff = await pendingOff.save();
    res.status(201).json(newPendingOff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;