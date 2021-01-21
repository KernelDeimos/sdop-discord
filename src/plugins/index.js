const { Module } = require('sdop');

module.exports = new Module({
  documentation: `
    Installs optional plugin modules for Discord bots.
  `,
}, c => {
  var r = c.registry;
  r.put('Module', 'sdop.discord.plugin.Data', require('./Data'));
  r.put('Module', 'sdop.discord.plugin.Permissions', require('./Permissions'));
  // r.put('Module', 'sdop.discord.plugin.Warn', require('./Warn'));
});
