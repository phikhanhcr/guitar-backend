const express = require('express');
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');

const { DonHang, validateDonHang } = require('../models/DonDatHang');
const { User } = require('../models/User');
const { Cart } = require('../models/Cart');
const ConvertOrder = require('../middleware/ConvertOrder');
const { MyOrder } = require('../models/OrderAdmin');
const { assignWith } = require('lodash');

router.get('/myOrder', async (req, res) => {
  try {
    const allDonHang = await MyOrder.find({ userId: req.user })
      .populate('cart.idProduct', 'name price img groupInstrument')
    //console.log(ConvertOrder(allDonHang))
    if (!allDonHang.length) {
      return res.send("Nothing in order list")
    }
    res.json(allDonHang)
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

  if (error) {
    logger.error('Bad request, check req.body');
    return res.status(400).send("Bad request, check req.body")
  }
  const checkUser = await User.findById(req.user);
  if (!checkUser) {
    return res.json(401).send("Invalid Token")
  }


  const newOrder = new DonHang(_.pick(req.body,
    ["name", "address", "email", "phone", "note", "payByCash", "cart", "userId"]
  ))
  newOrder.save();
  const convertedArr = ConvertOrder(newOrder)
  // const allMyOrder = await MyOrder.find();
  console.log("Convert data")
  console.log(convertedArr)
  

  for(var i of convertedArr ) {
    try {
      let newOrder = await MyOrder.create(_.pick(i , 
        ["name", "address", "email", "phone", "note", "condition", "payByCash", "cart", "userId"]
      ))
      console.log(newOrder);
    } catch (error) {
      console.log(error)
    }
  }

  const userCart = await Cart.findOne({ userId: req.user })
  console.log("User cart")
  console.log(userCart.cart)
  if (userCart.cart.length) {
    userCart.cart = []
  }
  await userCart.save();
  // post to order

  return res.json({
    newOrder,
    clear: userCart.cart,
  })
})


module.exports = router;