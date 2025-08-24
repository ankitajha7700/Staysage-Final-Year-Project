const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/authController")
const {isLoggedin} = require("../middlewares/isLoggedin")
const hostelModel = require("../models/hostelModel");

router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/admin", isLoggedin, (req, res) => {
    const user = req.user;
    // console.log(user.isadmin);
    if (user.isadmin) {
        let success = req.flash("success");
        res.render("createproducts", {success, user});
    } else {
        res.redirect("/hostels");
    }
});


router.get("/manage", isLoggedin, async (req, res) => {
    const user = req.user;
    if (user.isadmin) {
        const hostels = await hostelModel.find({User: user._id}).populate();
        res.render("managehostels", {hostels, user});
    } else {
        res.redirect("/hostels");
    }
});

router.delete("/hostels/:id", isLoggedin, async (req, res) => {
    try {
        const hostel = await hostelModel.findById(req.params.id);
        
        // Check if hostel exists and user owns it
        if (!hostel || hostel.User.toString() !== req.user._id.toString()) {
            return res.status(403).json({error: "Not authorized to delete this hostel"});
        }

        // Remove hostel from user's hostels array
        const user = req.user;
        user.hostels = user.hostels.filter(hostelId => hostelId.toString() !== req.params.id);
        await user.save();

        // Delete the hostel
        await hostelModel.findByIdAndDelete(req.params.id);
        res.json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error deleting hostel"});
    }
});

module.exports = router;
