const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Appointment = require("./models/Appointment");



const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});


// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/medipulse")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("MediPulse backend running");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srivatsanrterm28j@gmail.com",
    pass: "jzlq pnio fkyi cuak"
  }
});


// Booking API
app.post("/book", async (req, res) => {
  try {
    const { doctorName, hospitalName, timeSlot, userEmail } = req.body;

    if (!doctorName || !hospitalName || !timeSlot || !userEmail) {
      return res.json({ message: "Missing data" });
    }

    // Check slot availability
    const exists = await Appointment.findOne({ doctorName, timeSlot });
    if (exists) {
      return res.json({ message: "Slot already booked" });
    }

    // Save booking
    await Appointment.create({
      doctorName,
      hospitalName,
      timeSlot,
      userEmail
    });

    // Send confirmation mail
    await transporter.sendMail({
      from: "srivatsanrterm28j@gmail.com",
      to: userEmail,
      subject: "MediPulse Appointment Confirmed",
      text: `
Appointment Confirmed!

Doctor: ${doctorName}
Hospital: ${hospitalName}
Time Slot: ${timeSlot}

Thank you for choosing MediPulse 💙
`
    });

    res.json({ message: "Appointment booked & email sent!" });

  } catch (error) {
    console.error(error);
    res.json({ message: "Booking saved but email failed" });
  }
});

// Get appointments by user email
app.get("/appointments/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const appointments = await Appointment.find({ userEmail: email });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});