const { Module } = require('sdop');

module.exports = new Module({}, c => {
  var r = c.registry;
  r.put('Registrar', 'sdop.discord.Command', {});
  r.put('Registrar', 'sdop.dicsord.MultiCommand', {
    put: c => {
      var name = c.name;
      var defaultfn = c.value.default;
      var beforefn = c.value.before || (c => c);
      var afterfn = c.value.after || (c => c);
      r.put('sdop.discord.Command', c.name, {
        fn: c => {
          if ( c.args.length < 2 ) {
            if ( defaultfn ) {
              return afterfn(defaultfn(beforefn(c)));
            }
            else {
              c.error = `usage: ${args[0]} <subcommand>`;
              return c;
            }
          }
          var cmdfn = r.get('sdop.discord.Command', `${name}.${c.args[1]}`);
          if ( ! cmdfn ) {
            c.msg.reply('unknown command');
            return c;
          }
          var scmd = c.args[1];
          c = beforefn(c);
          c = cmdfn.fn({
            ...c,
            args: c.args.slice(1)
          });
          c = afterfn(c);
        }
      })
      return c;
    }
  });

  return c;
});
