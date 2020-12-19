var express = require('express');
var router = express.Router();
const userController = require("../controllers/user")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userController.register);

router.post('/register-phone', userController.registerPhone);

router.post('/verify-otp', userController.verifyOTP);

module.exports = router;
