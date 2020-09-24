const express = require('express');
const logger = require('../config/Looger');
const router = express.Router();

const { Catalog } = require('../models/catalogs');
const { Product, validateProduct } = require('../models/musicalInstrument');

router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    console.log(err)
  }
})

router.post('/', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).send("Checking input - validation ");
  }
  console.log(error)
  const catalog = await Catalog.findById(req.body.catalogId)
  if (!catalog) {
    logger.error('Invalid catalog');
    return res.status(400).send("Invalid catalog")
  }
  console.log(catalog)
  console.log(req.body.name)

  try {
    const newPro = await Product.create({
      name: req.body.name,
      catalog: catalog
    })
    res.json(newPro);
  } catch (error) {
    console.log(error);
  }
})

//  display all products following catalog ( ex : dan-guitar-acoustic)
router.get('/:catalog', async (req, res) => {
  const catalog = await Catalog.findOne({ 
    linkRef: req.params.catalog 
  })
  console.log(catalog)
  if (!catalog) {
    return res.status(400).send("Invalid catalog's id")
  }
  try {
    const eachGroup = await Product.find({
      catalog: catalog
    })
    res.json(eachGroup)
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;