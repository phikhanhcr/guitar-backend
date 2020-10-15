const { User, validateLogin } = require("../models/User");
const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const logger = require("../config/Looger");
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.post('/', asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(200).json({
      emailNotFound: "User doesn't exists!"
    })
  }
  // compare password 
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(200).json({
      wrongPass: "Wrong Password!"
    })
  }

  //  set json web token , cookies or doing anything you want 
  return res.status(200).send("Oce");
}))

module.exports = router;