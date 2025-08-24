const express = require("express");
const upload = require("../config/multerConfig");
const router = express.Router();
const hostelModel = require("../models/hostelModel");
const { isLoggedin } = require("../middlewares/isLoggedin");

router.get("/", async (req, res) => {
  try {
    const hostels = await hostelModel.find();
    res.render("hostels", { hostels });
  } catch (error) {
    res.status(500).send("Error fetching hostels");
  }
});

router.post("/create", isLoggedin, upload.single("image"), async (req, res) => {
  try {
    let user = req.user;
    if (!user || !user.isadmin) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/hostels");
    }

    let { name, price, contact, location, description, specialFeatures } = req.body;
    
    if (!name || !price || !contact || !location || !description || !req.file) {
      req.flash("error", "All fields are required");
      return res.redirect("/users/admin");
    }

    let hostel = await hostelModel.create({
      image: req.file.buffer,
      name,
      price: Number(price),
      contact: Number(contact),
      location,
      description,
      specialFeatures: specialFeatures.split(',').map(feature => feature.trim()),
      User: user._id
    });

    // Add hostel to user's hostels array
    await user.hostels.push(hostel._id);
    await user.save();

    req.flash("success", "Hostel added successfully");
    res.redirect("/users/admin");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong");
    res.redirect("/users/admin");
  }
});

module.exports = router;
