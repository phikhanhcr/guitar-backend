const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');
const { Cart, validateCart } = require('../models/Cart');
const { User } = require('../models/User');
const { EachProduct } = require('../models/eachProduct');

router.get('/', asyncMiddleware(async (req, res) => {
  const cart = await Cart.find();
  res.json(cart)
}))

router.post('/', (req, res) => {
  const { error } = validateCart(req.body);
  if (error) {
    logger.error('Check input field')
    return res.status(400).send("Check input field");
  }
  // check current userId
  const currentUser = await User.findById(req.body.userId)
  if (!currentUser) {
    return res.status(400).send("Cut");
  }

  // check id product 
  const idPro = await EachProduct.findById(req.body.idProduct)
  if (!idPro) {
    return res.status(400).send("Cut");
  }

  // new one
  
  // already exist
})

module.exports = router;