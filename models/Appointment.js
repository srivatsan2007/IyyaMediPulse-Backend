const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  doctorName: String,
  hospitalName: String,
  timeSlot: String,
  userEmail: String,
  bookedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
