const express = require("express");
const router = express.Router();
const {isLoggedin} = require("../middlewares/isLoggedin")
const hostelModel = require("../models/hostelModel");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  console.log('Cookies:', req.cookies);
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (!decoded) {
        res.clearCookie("token");
        let error = req.flash("error");
        return res.render("index", {error});
      }
      return res.redirect("/hostels");
    } catch (error) {
      res.clearCookie("token");
    }
  }
  let error = req.flash("error");
  res.render("index", {error});
});

router.get("/hostels", isLoggedin, async (req, res) => {
  try {
    const { specialFeatures } = req.query;
    let filter = {};

    if (specialFeatures) {
      filter.specialFeatures = { $in: specialFeatures.split(',') };
    }

    const hostels = await hostelModel.find(filter);
    const user = req.user;
    res.render("hostels", { hostels, user });
  } catch (error) {
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

router.get("/hostels/:id", isLoggedin, async (req, res) => {
  try {
    const hostel = await hostelModel.findById(req.params.id);
    if (!hostel) {
      req.flash("error", "Hostel not found");
      return res.redirect("/hostels");
    }
    const user = req.user;
    res.render("hostel", {hostel, user});
  } catch (error) {
    req.flash("error", "Something went wrong");
    res.redirect("/hostels");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
});

module.exports = router;
