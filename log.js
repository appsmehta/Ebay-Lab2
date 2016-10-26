var winston = require('winston');
winston.add(winston.transports.File, { filename: "./log/results.log" });
module.exports=winston;