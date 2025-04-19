const mongoose = require('mongoose');
const { Schema } = mongoose;

const pendingOffSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  offDate: { type: Date, required: true },
});

module.exports = mongoose.model('PendingOff', pendingOffSchema);