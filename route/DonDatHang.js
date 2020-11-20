const express = require('express');
const logger = require("../config/Looger");
const router = express.Router();
const _ = require('lodash');

const { DonHang, validateDonHang } = require('../models/DonDatHang')
router.get('/', async (req, res) => {
  try {
    const allDonHang = await DonHang.find();
    res.json(allDonHang)
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
  try {
    const newDonHang = await DonHang.create(_.pick(req.body, ['name', 'address', 'email', 'phone', 'note']))
    res.json(newDonHang);
  } catch (error) {
    console.log(error)
  }
})
module.exports = router;