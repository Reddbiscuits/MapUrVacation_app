const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Location = require("../models/locations.model");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/register", (req, res, next) => {
  // console.log("Boo!")
  res.render("user/userCreate");
});

router.post("/userCreate", (req, res) => {
  const salt = bcrypt.genSaltSync(saltRounds);

  const hash1 = bcrypt.hashSync(req.body.password, salt);

  User.create({ username: req.body.username, password: hash1 }).then(() => {
    res.redirect("/indextwo");
  });
});

// router.get('/user/:theID', (req, res) => {

//   req.params.theID // ==> 61052265119dbf8593258766

//   User.findById(req.params.theID)
//     .then((oneUser) => {
//       // console.log('Retrieved film from DB:', oneFilm)
//       res.render('locations/show.hbs', { oneUser: oneUser });
//       // res.send(oneFilm)
//     })
// });

router.get("/testtest", (req, res) => {
  res.render("locations/show");
});

// LOGIN FLOW
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/userHomeBase", (req, res) => {
  res.render("user/userHomeBase", { theUsername: req.session.currentUser.username });
});

router.get("/userprofile", (req, res) => {
  if (!req.session.currentUser) {
    res.send("user not found - go to login and log in");
  } else {
    //req.session.currentUser.username
    User.findById(req.session.currentUser._id).then((user) => {
      Location.find({ user: req.session.currentUser._id }).then((locsOfCurrentUser) => {
        console.log(locsOfCurrentUser);
        res.render("userprofile", { theUsername: req.session.currentUser.username, myLongitude: user.longitude, myLatitude: user.latitude, myLocations: locsOfCurrentUser });
      });
    });
  }
});

router.post("/login-the-user", (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      res.send("user not found");
    }
    // if User.exists({latitude && longitude}) => {
    //   res.redirect("/userprofile");
    // }
    // if (bcrypt.compareSync(req.body.password, user.password)) && (User.exists(user.latitude && user.longitude)) {
    //   req.session.currentUser = user;
    //   res.redirect("/userprofile");
    // }

    //user.password // from db (hashed)
    //req.body.password // from browser
    if (bcrypt.compareSync(req.body.password, user.password)) {
      if (user.latitude && user.longitude) {
        req.session.currentUser = user;
        res.redirect("/userprofile");
      } else {
        req.session.currentUser = user;
        res.redirect("/userHomeBase");
      }
    } else {
      res.send("password not correct");
    }
  });
});

router.post("/save-home-base", (req, res) => {
  User.findByIdAndUpdate(req.session.currentUser._id, {
    longitude: req.body.theLongitude,
    latitude: req.body.theLatitude,
  }).then(() => {
    res.redirect("/userprofile");
  });
});

router.post("/users/:theID/delete", (req, res, next) => {
  // Delete the User
  User.findByIdAndDelete(req.session.currentUser._id).then(() => {
    res.redirect("/index");
  });
});

module.exports = router;
