const express = require('express');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');
const { Cart, validateCart } = require('../models/Cart');
const { User } = require('../models/User');
const { EachProduct } = require('../models/eachProduct');
const Fawn = require('fawn');
const { Router } = require('express');

Fawn.init("mongodb://localhost:27017/guitar-shop");
var task = Fawn.Task();

router.get('/', asyncMiddleware(async (req, res) => {
  const cart = await Cart
    .findOne({ userId: req.user })
    .populate('cart.idProduct', 'name price img')
  res.json(cart)
}))

router.post('/', async (req, res) => {
  const { error } = validateCart(req.body);
  if (error) {
    logger.error('Check input field')
    return res.status(400).send("Check input field");
  }

  // check id product 
  const idPro = await EachProduct.findById(req.body.idProduct)
  if (!idPro) {
    return res.status(400).send("Cut");
  }
  if (idPro.numberInStock <= 0) {
    return res.status(200).json({
      outOfStock: "Hết Hàng"
    })
  }
  // cart of current user
  var currentCart = await Cart.findOne({ userId: req.user })
  if (!currentCart) {
    let newCart = {
      userId: req.user,
      cart: [{
        idProduct: req.body.idProduct,
        amount: parseInt(req.body.amount)
      }]
    }

    try {
      currentCart = new Cart({
        userId: req.user,
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

//  put update amount of item 
router.put('/:userId/:proId', async (req, res) => {
  const { userId, proId } = req.params;
  const { amount } = req.body;
  console.log({userId, proId, amount})
  try {
    const userCart = await Cart.findOne({userId})
    // chosenCart.cart = array 
    const updatedItem = userCart.cart.findIndex(ele => {
      return ele._id == proId
    })
    userCart.cart[updatedItem].amount = amount;
    await userCart.save();
    return res.status(200).json(userCart)
  } catch (error) { 
    console.log(err);
  }
})




router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const chosenCart = await Cart.findOne({ userId: userId });
    if (!chosenCart) {
      return res.status(400).json({
        message: "Item not found"
      })
    }
    return res.json(chosenCart)
  } catch (error) {
    console.log(err);
  }
})

router.delete('/:userId/:proId', async (req, res) => {
  const { userId, proId } = req.params;
  try {
    const chosenCart = await Cart.findOne({ userId: userId });
    // chosenCart.cart = array 
    const findIndex = chosenCart.cart.findIndex(ele => {
      return ele._id == proId
    })
    if (findIndex !== -1) {
      chosenCart.cart.splice(findIndex, 1);
      chosenCart.save();
      return res.status(200).json({ findIndex })
    } else {
      return res.status(200).json({
        message: "product not found"
      })
    }
  } catch (error) {
    console.log(error);
  }
})

// transfer cart remove all 


module.exports = router;