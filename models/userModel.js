const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: Number,
  isadmin: {
    type: Boolean,
    default: false,
  },
  password: String,
  hostels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  }]
});

module.exports = mongoose.model("user", userSchema);