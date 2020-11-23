const { User, validateLogin } = require("../models/User");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  const { email, password } = req.body;
  if (error) {
    return res.send(200).send("Check req.body");
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(200).json({
      emailNotFound: "User doesn't exists!"
    })
  }
  const checkPassword = await bcrypt.compare(password, user.password)
  if (!checkPassword) {
    return res.status(201).json({
      wrongPass: "Wrong Password!"
    })
  }
  if (!user.isAdmin) {
    return res.status(201).json({
      adminFail: "You must be an administrator before logging in!"
    })
  }
  // create a token-admin
  const token = user.generateAuthTokenAdmin();
  return res.header('x-auth-token-admin', token).status(200).send({
    token: token,
    user: user
  })
})


router.post('/isValidToken', async (req, res) => {
  const token = req.header('x-auth-token-admin');
  if (!token) return res.json(false)
  try {
    const verified = jwt.verify(token, process.env.JWTKey)
    if (!verified) return res.json({
      message: false
    })
    return res.json({
      admin: verified,
      tokenAdmin: token
    })
  } catch (error) {
    return res.json({
      fail : error
    })
  }

})

module.exports = router;