var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
      app: process.env.APP_NAME,
      version: process.env.APP_VER
  });
});

module.exports = router;
