const winston = require('winston');
require('winston-mongodb')

const myformat = winston.format.cli({ colors: { info: 'blue' }});

const logger = winston.createLogger({
  level : 'info',
  transports : [
    new winston.transports.File({
      filename : "notice.log",
      level : 'info' ,
      format : winston.format.combine(winston.format.timestamp(), winston.format.json())
    }),
    new winston.transports.File({
      filename : "error.log",
      level : 'error' ,
      format : winston.format.combine(winston.format.timestamp(), winston.format.json())
    }),
    new winston.transports.Console({
      level : 'silly' ,
      format : myformat
    }),
    new winston.transports.MongoDB({
      db : 'mongodb://localhost:27017/TestUdemy',
      collection : 'log', 
      level : 'error',
      capped : true 
    })
  
  ]
})

module.exports = logger;