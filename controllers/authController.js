const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateTokens")

module.exports.registerUser = async function (req, res) {
  try {
    let { name, email, contact, password } = req.body;

    let user = await userModel.findOne({email:email})
    if(user) {
      req.flash("error", "user already exists");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let newUser = await userModel.create({
      name,
      email, 
      contact,
      password: hash,
    });

    let token = generateToken(newUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    });
    res.redirect("/hostels");

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during registration");
    return res.redirect("/");
  }
};

module.exports.loginUser = async function(req, res) {
  try {
    let {email, password} = req.body;
    let user = await userModel.findOne({email:email});

    if(!user) {
      req.flash("error", "email or password incorrect");
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      });
      res.redirect("/hostels");
    } else {
      req.flash("error", "email or password incorrect");
      return res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during login");
    return res.redirect("/");
  }
}
