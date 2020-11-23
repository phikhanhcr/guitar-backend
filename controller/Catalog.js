const { Catalog, validateCatalog } = require('../models/catalogs')
const asyncMiddleware = require('../middleware/asyncMiddleware');
const logger = require('../config/Looger');
const removeAccents = require('../middleware/removeAccents');

module.exports.getAllPro = asyncMiddleware(async (req, res) => {
  const catalogs = await Catalog.find();
  res.json(catalogs);
})

module.exports.createNew = asyncMiddleware(async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) {
    logger.error('Check req.body')
    return res.status(400).send(error.details[0].message)
  }
  const checkCatalog = await Catalog.find({ name: req.body.name })
  if (checkCatalog.length) {
    return res.status('200').send({
      catalogExist: "Exists Catalog"
    })
  }
  console.log(checkCatalog)
  try {
    var newCatalog = await Catalog.create({
      name: req.body.name
    })
    console.log(newCatalog)
    res.json(newCatalog)
    logger.info("Created a new catalog")
  } catch (err) {
    res.send("Bad request 400")
    console.log(err)
  }
})

module.exports.deletePro = asyncMiddleware(async (req, res) => {
  const item = await Catalog.findOne({ linkRef: req.params.linkRef })
  if (!item) {
    return res.status(400).send("Wrong link Ref")
  }

  try {
    const chosenOne = await Catalog.findOneAndRemove({ linkRef: req.params.linkRef })
    res.json(chosenOne)
  } catch (error) {
    res.send("error")
  }

})

module.exports.editCatalogs = asyncMiddleware(async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) {
    logger.error('Check req.body')
    return res.status(400).send(error.details[0].message)
  }

  const item = await Catalog.findOne({ linkRef: req.params.linkRef })
  if (!item) {
    return res.status(400).send("Wrong link Ref")
  }

  try {
    const updateChooseOne = await Catalog.findOneAndUpdate({ linkRef: req.params.linkRef }, {
      name: req.body.name,
      linkRef: removeAccents(req.body.name.toLowerCase()).split(" ").join('-'),
      editAt: new Date()
    }, {
      new: true
    })
    res.json(updateChooseOne)
  } catch (err) {
    res.json({
      error: "Error"
    })
  }
})


module.exports.deleteAll = asyncMiddleware(async (req, res) => {
  await Catalog.remove();
  res.json({
    message: "removed successfully"
  })
})



module.exports.findByLinkLef = asyncMiddleware(async (req, res) => {
  const item = await Catalog.findOne({ linkRef: req.params.linkRef })
  if (!item) {
    return res.status(400).send("Wrong link Ref")
  }
  try {

    res.json(item)
  } catch (error) {
    res.json({ message: error })
  }
})