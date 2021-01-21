const { Module } = require('sdop');

// TODO: use Sequence for common conditions
module.exports = new Module({}, c => {
  var r = c.registry;

  var get_perms_from_roles = (c, roleIds) => {
    var permSet = {};
    for ( let role of roleIds ) {
      var id = `sdop.discord.guild(${c.msg.guild.id}).role(${role})`;
      var perms = r.get('sdop.discord.Permissions', id);
      if ( perms ) {
        for ( let perm of perms ) {
          console.log('ye?', perm);
          permSet[perm] = true;
        }
      }
    }
    return Object.keys(permSet);
  };

  var check_dab_sudo = c => {
    if ( c.msg.member.hasPermission('ADMINISTRATOR') ) return true;
    return false;
  };

  r.put('Function', 'sdop.discord.permissions.get', c => {
    if ( ! c.msg.guild ) {
      return [];
    }
    var roleIds = c.msg.member.roles.cache.map(r => r.id);
    return get_perms_from_roles(c, roleIds);
  })

  r.put('sdop.discord.Jrl', 'sdop.discord.Permissions');

  r.put('sdop.discord.Jrl', 'sdop.discord.Permissions');
  r.put('sdop.discord.MultiCommand', 'sdop.discord.cmd.perm');
  r.put('sdop.discord.Command', 'sdop.discord.cmd.perm.test', {
    fn: c => {
      console.log(c.args);
      c.msg.reply(JSON.stringify(c.args));
      return c;
    }
  })
  r.put('sdop.discord.Command', 'sdop.discord.cmd.perm.show-roles', {
    fn: c => {
      if ( ! c.msg.guild ) {
        c.msg.reply('Invalid; command can only be used on a server');
        return c;
      }
      var member = c.msg.mentions.members.first() || c.msg.member;
      c.msg.reply(
        '\n- ' + member.roles.cache
          .filter(r => r.name != '@everyone')
          .map(r => [r.id, r.name]
          .join(': ')
        ).join('\n- '));
      return c;
    }
  })
  r.put('sdop.discord.Command', 'sdop.discord.cmd.perm.add', {
    fn: c => {
      if ( ! c.msg.guild ) {
        c.msg.reply('Invalid; command can only be used on a server');
        return c;
      }
      if ( c.args < 3 ) {
        c.msg.reply(`Invalid; usage: <prefix> perm add <role> <permission>`);
        return c;
      }
      if ( ! check_dab_sudo(c) ) {
        c.msg.reply(`You must be admin to do this`);
        return c;
      }
      var role = c.args[1];
      var perm = c.args[2];
      var id = `sdop.discord.guild(${c.msg.guild.id}).role(${role})`;
      var perms = r.get('sdop.discord.Permissions', id);
      if ( ! perms ) {
        perms = [];
      }
      if ( perms.indexOf(perm) == -1 ) perms.push(perm);
      r.put('sdop.discord.Permissions', id, perms);
      c.msg.reply(`Permission "${perm}" added to role "${role}"`);
      return c;
    }
  });
  r.put('sdop.discord.Command', 'sdop.discord.cmd.perm.remove', {
    fn: c => {
      if ( ! c.msg.guild ) {
        c.msg.reply('Invalid; command can only be used on a server');
        return c;
      }
      if ( c.args < 3 ) {
        c.msg.reply(`Invalid; usage: <prefix> perm add <role> <permission>`);
        return c;
      }
      if ( ! check_dab_sudo(c) ) {
        c.msg.reply(`You must be admin to do this`);
        return c;
      }
      var role = c.args[1];
      var perm = c.args[2];
      var id = `sdop.discord.guild(${c.msg.guild.id}).role(${role})`;
      var perms = r.get('sdop.discord.Permissions', id);
      var i = perms.indexOf(perm);
      if ( i != -1 ) perms.splice(i, 1);
      r.put('sdop.discord.Permissions', id, perms);
      c.msg.reply(`Permission "${perm}" removed from role "${role}"`);
      return c;
    }
  });
  r.put('sdop.discord.Command', 'sdop.discord.cmd.perm.show-user-perms', {
    fn: c => {
      if ( ! c.msg.guild ) {
        c.msg.reply('Invalid; command can only be used on a server');
        return c;
      }
      if ( c.args < 2 ) {
        c.msg.reply(`Invalid; usage: <prefix> perm add <role> <permission>`);
        return c;
      }
      var member = c.msg.mentions.members.first() || c.msg.member;
      var roleIds = member.roles.cache.map(r => r.id);
      console.log('a', roleIds);
      var perms = get_perms_from_roles(c, roleIds);
      console.log('b', perms);
      c.msg.reply(perms.join(', '));
      return c;
    }
  });
  return c;
});
