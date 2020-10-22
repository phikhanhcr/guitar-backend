const { User, validateLogin } = require("../models/User");
const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { checkAuthToken } = require("../middleware/AuthTokenMiddleware");

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
  const token = user.generateAuthToken();
  return res.header('x-auth-token', token).status(200).send({
    token: token,
    user: user
  })
}))

router.post('/isValidToken', async (req, res) => {
  // check token
  const token = req.header('x-auth-token');
  if (!token) return res.json(false)

  // verify token
  const verified = jwt.verify(token, process.env.JWTKey)
  if (!verified) return res.json(false)

  // check user
  const user = await User.findById(verified._id)
  if (!user) return res.json(false)

  return res.json(true)
})

router.get('/', checkAuthToken, async (req, res, next) => {
  const user = await User.findById(req.user)
  res.json({
    email: user.email,
    _id: user._id
  })
})
module.exports = router;