const { User, validateLogin } = require("../models/User");
const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const logger = require("../config/Looger");
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.get('/', asyncMiddleware(async (req, res) => {
  const allUser = await User.find();
  res.json(allUser)
}))

router.post('/', asyncMiddleware(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    logger.error('Check input field')
    return res.status(400).send("Check input field");
  }
  let user = await User.findOne({ email: req.body.email })
  if (user) {
    logger.error('User already exists!')
    return res.status(400).json({
      status: "Error",
      message: "User already exists!"
    })
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  console.log(hashedPass)
  const newUser = new User(_.pick(req.body, ['email' , 'password']))
  newUser.password = hashedPass;
  newUser.save();
  res.json(newUser)
}))

module.exports = router;