const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    Subject: { type: String },
    AppointmentStartDate: { type: Date, required: true },
    AppointmentEndDate: { type: Date, required: true },
    Status: { type: String },
    UserId: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const AppointmentBookings = mongoose.model(
  "AppointmentBookings",
  appointmentSchema
);

module.exports = AppointmentBookings;
