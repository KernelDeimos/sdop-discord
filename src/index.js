const { Module } = require('sdop');
module.exports = new Module({}, c => {
  require('./definitions/index')(c);
  return c;
});
