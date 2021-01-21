const { Module } = require('sdop');
module.exports = new Module({}, c => {
  var r = c.registry;
  r.put('Journal', 'sdop.discord.Jrl', {
    file: './sdop_discord.jrl'
  });
  return c;
});
