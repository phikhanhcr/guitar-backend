const express = require('express');
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');

const { DonHang, validateDonHang } = require('../models/DonDatHang');

const ConvertOrder = require('../middleware/ConvertOrder');
const { MyOrder } = require('../models/OrderAdmin');

router.get('/', async (req, res) => {
  try {
    const allDonHang = await MyOrder.find()
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

router.put('/:id', async (req, res) => {
  console.log("Id product " + req.params.id)

  const { condition } = req.body;
  console.log("Condition " + condition)
  try {
    const updatedCart = await MyOrder.findById(req.params.id)
    updatedCart.condition = condition;
    updatedCart.save();
    // chosenCart.cart = array 
    return res.status(200).json({
      message : "Update successfully"
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;