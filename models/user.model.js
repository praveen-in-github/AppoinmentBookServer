const mongoose = require("mongoose");

const userModal = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, maxlength: 4 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModal);

module.exports = User;
