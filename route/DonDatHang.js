const express = require('express');
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');

const { DonHang, validateDonHang } = require('../models/DonDatHang');
const { User } = require('../models/User');
const { Cart } = require('../models/Cart');
const ConvertOrder = require('../middleware/ConvertOrder');
router.get('/myOrder', async (req, res) => {
  try {
    const allDonHang = await DonHang.find({ userId: req.user })
      .populate('cart.idProduct', 'name price img groupInstrument')
      console.log("My order")
      console.log(allDonHang)
    //console.log(ConvertOrder(allDonHang))
    if (!allDonHang.length) {
      return res.send("Nothing in order list")
    }
    res.json(ConvertOrder(allDonHang))
  } catch (error) {
    console.log(error)
  }
})
router.delete('/:id', async (req, res) => {
  try {
    const pickedOrder = await DonHang.findByIdAndRemove(req.params.id);
    res.json(pickedOrder)
  } catch (error) {
    console.log(error)
  }
})

router.post('/', async (req, res) => {
  const { error } = validateDonHang(req.body)
  console.log(error)
  if (error) {
    logger.error('Bad request, check req.body');
    return res.status(400).send("Bad request, check req.body")
  }
  const checkUser = await User.findById(req.user);
  if (!checkUser) {
    return res.json(401).send("Invalid Token")
  }
  // check idProducts array
  console.log(req.body)

  const newOrder = new DonHang(_.pick(req.body,
    ["name", "address", "email", "phone", "note", "payByCash", "cart", "userId"]
  ))
  newOrder.save();

  const userCart = await Cart.findOne({ userId: req.user })
  console.log("User cart")
  console.log(userCart.cart)
  if (userCart.cart.length) {
    userCart.cart = []
  }
  await userCart.save();
  return res.json({
    newOrder,
    clear: userCart.cart,
  })
})

module.exports = router;