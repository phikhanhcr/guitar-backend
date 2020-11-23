const express = require('express');
const router = express.Router();
const controller = require('../controller/EachProduct')
const multer  = require('multer')
const upload = multer({ dest: '../uploads' })
router.get('/', controller.getAllProduct)

router.post('/', upload.single('avatar'), controller.postProduct )

router.get('/:group', controller.getGroup )

router.get('/:group/:item', controller.getSpecificItem )

router.delete('/:item', controller.deleteItem )


// router.get('/:linkRef', async (req, res ) => {
//   const chooseOne = await EachProduct.findOne({
//     linkRef : req.params.linkRef
//   })
//   if(!chooseOne) {
//     return res.status(400).send("Invalid link reference")
//   }
//   res.json(chooseOne);
// })


module.exports = router;