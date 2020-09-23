const express = require('express');
const router = express.Router();
const { Catalog, validateCatalog } = require('../models/catalogs')
const asyncMiddleware = require('../middleware/asyncMiddleware');
const controllerCatalog = require('../controller/Catalog')

router.get('/', controllerCatalog.getAllPro)

router.post('/', controllerCatalog.createNew)

router.delete('/:linkRef', controllerCatalog.deletePro )

router.delete('/' ,  controllerCatalog.deleteAll )

router.get('/:linkRef', controllerCatalog.findByLinkLef)

router.put('/:linkRef', controllerCatalog.editCatalogs)

module.exports = router;