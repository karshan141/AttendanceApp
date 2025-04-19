const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true }, // 'P' for Present, 'A' for Absent, etc.
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // Ensure one record per employee per day

module.exports = mongoose.model('Attendance', attendanceSchema);