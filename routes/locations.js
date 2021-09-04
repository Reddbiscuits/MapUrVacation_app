const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Locations = require("../models/locations.model");

router.post("/save-new-loc", (req, res) => {
  Locations.create({ name: req.body.newname, longitude: req.body.newLongitude, latitude: req.body.newLatitude }).then(() => {
    res.redirect("/userprofile");
  });
});

module.exports = router;

// Locations.create({ longitude: req.body.newLongitude, latitude: req.body.newLatitude, }).then(() => {
//   res.redirect("/indextwo");
// });
