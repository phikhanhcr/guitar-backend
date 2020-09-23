const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('../config/Looger')

module.exports = function () {
  mongoose.connect(process.env.MongoDB, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    logger.info(`Connected to ${process.env.MongoDB}`)
  });

}