var path = require('path');
var log = require('npmlog');

//log.heading('tablebuilder');

module.exports = {
  port: '8080',
  root: path.resolve('./'),
  build: path.resolve('./build'),
  log: log
};
