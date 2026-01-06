const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  speciality: String,
  hospital: String,
  city: String,
  slots: [String],        // all possible slots
  bookedSlots: [String]   // already booked slots
});

module.exports = mongoose.model("Doctor", doctorSchema);
