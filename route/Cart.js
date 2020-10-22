const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');
const { Cart, validateCart } = require('../models/Cart');
const { User } = require('../models/User');
const { EachProduct } = require('../models/eachProduct');
const Fawn = require('fawn')

Fawn.init("mongodb://localhost:27017/guitar-shop");
var task = Fawn.Task();

router.get('/', asyncMiddleware(async (req, res) => {
  console.log(req.user)
  const cart = await Cart
    .findOne({ userId: req.user })
    .populate('cart.idProduct', 'name price')
  res.json(cart)
}))

router.post('/', async (req, res) => {
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
  // cart of current user
  var currentCart = await Cart.findOne({ userId: req.body.userId })
  if (!currentCart) {
    let newCart = {
      userId: req.body.userId,
      cart: [{
        idProduct: req.body.idProduct,
        amount: parseInt(req.body.amount)
      }]
    }

    try {
      currentCart = new Cart({
        userId: req.body.userId,
        cart: [{
          idProduct: req.body.idProduct,
          amount: req.body.amount
        }]
      })
      res.json(newCart)
    } catch (error) {
      console.log(error);
    }

  } else {
    // check id product exists ? 
    if (currentCart.cart === undefined) {
      currentCart.cart = [];
    }
    console.log(currentCart.cart)
    var existPro = currentCart.cart.filter(ele => {
      return ele.idProduct == req.body.idProduct
    })

    if (!existPro.length) {
      currentCart.cart.push({
        idProduct: req.body.idProduct,
        amount: req.body.amount
      })

    } else {
      existPro[0].amount += parseInt(req.body.amount)
    }
  }
  await EachProduct.findByIdAndUpdate(req.body.idProduct, {
    $inc: { numberInStock: - parseInt(req.body.amount) }
  });
  await currentCart.save();
  console.log(typeof idPro)
  res.json(currentCart);
})

module.exports = router;