const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: Buffer,
  contact: Number,
  price: Number,
  location: String,
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  specialFeatures: { type: [String], default: [] }, // Array of special features
});

module.exports = mongoose.model("hostel", hostelSchema);
