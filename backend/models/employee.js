const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  weeklyOffDay: { type: String },
});

module.exports = mongoose.model('Employee', employeeSchema);