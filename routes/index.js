const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/indextwo', (req, res, next) => {
  res.render('indextwo');
});

module.exports = router;
