const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel")


if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let { name, email, contact, password } = req.body;
    let createdOwner = await ownerModel.create({ name, email, contact, password });
    res.send(createdOwner);
  });
}








module.exports = router;
