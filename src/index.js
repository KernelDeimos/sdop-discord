const { Module } = require('sdop');
module.exports = new Module({}, c => {
  require('./definitions/index')(c);
  require('./plugins/index')(c);
  return c;
});
