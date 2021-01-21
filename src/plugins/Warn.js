const { Module } = require('sdop');
module.exports = new Module({}, c => {
  var r = c.registry;
  r.put('sdop.discord.Command', 'dab.cmd.warn', {
    fn: c => {
      // TODO
      return c;
    }
  });
  return c;
});
