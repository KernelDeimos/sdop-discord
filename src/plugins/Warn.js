const { Module } = require('sdop');
module.exports = new Module({}, c => {
  var r = c.registry;
  r.put('sdop.discord.Jrl', 'sdop.discord.Warnings');
  r.put('sdop.discord.Command', 'sdop.discord.cmd.warn', {
    fn: c => {
      var perms = r.get('Function', 'sdop.discord.permissions.get')(c);
      if ( ! perms.includes('warn.warn') ) {
        c.msg.reply('missing permission: warn.warn');
        return c;
      }
      var warnee = c.msg.mentions.members.first();
      if ( ! warnee ) {
        c.msg.reply('please tag user to warn');
        return c;
      }
      if ( c.args.length < 3 ) {
        c.msg.reply(`usage: warn <tag> <reason>`);
        return c;
      }
      var id = `sdop.discord.guild(${c.msg.guild.id}).user(${warnee.id})`;
      var warns = r.get('sdop.discord.Warnings', id);
      if ( ! warns ) warns = { reasons: [] };
      warns.reasons.push(c.args.slice(2).join(' '));
      r.put('sdop.discord.Warnings', id, warns);
      c.msg.reply(`warned`);
      return c;
    }
  });
  r.put('sdop.discord.Command', 'sdop.discord.cmd.pardon', {
    fn: c => {
      var perms = r.get('Function', 'sdop.discord.permissions.get')(c);
      if ( ! perms.includes('warn.warn') ) {
        c.msg.reply('missing permission: warn.warn');
        return c;
      }
      var warnee = c.msg.mentions.members.first();
      if ( ! warnee ) {
        c.msg.reply('please tag user to pardon');
        return c;
      }
      var id = `sdop.discord.guild(${c.msg.guild.id}).user(${warnee.id})`;
      r.put('sdop.discord.Warnings', id, { reasons: [] });
      c.msg.reply(`pardoned`);
      return c;
    }
  });
  r.put('sdop.discord.Command', 'sdop.discord.cmd.show-warns', {
    fn: c => {
      var perms = r.get('Function', 'sdop.discord.permissions.get')(c);
      if ( ! perms.includes('warn.warn') ) {
        c.msg.reply('missing permission: warn.warn');
        return c;
      }
      var warnee = c.msg.mentions.members.first();

      if ( ! warnee ) {
        c.msg.reply('please tag user to show warns for');
        return c;
      }
      var id = `sdop.discord.guild(${c.msg.guild.id}).user(${warnee.id})`;
      var warns = r.get('sdop.discord.Warnings', id);
      if ( ! warns ) warns = { reasons: [] };
      console.log(warns);
      var rep = `this user has ${warns.reasons.length} warnings`;
      var rep2 = ( warns.reasons.length > 0 ) ?
        ':\n- ' + warns.reasons.join('\n- ') + '\n' : '';
      console.log(rep2);
      c.msg.reply(rep + rep2);
      return c;
    }
  });
  return c;
});
