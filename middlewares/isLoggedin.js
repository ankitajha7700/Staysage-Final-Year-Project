const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.isLoggedin = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You need to login first");
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select("-password");
    
    if (!user) {
      res.clearCookie("token");
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token"); 
    req.flash("error", "Session expired. Please login again");
    return res.redirect("/");
  }
};
