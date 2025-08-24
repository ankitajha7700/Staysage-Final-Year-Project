const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: Number,
  isadmin: {
    type: Boolean,
    default: true,
  },
  password: String,
});

module.exports = mongoose.model("owner", ownerSchema);
