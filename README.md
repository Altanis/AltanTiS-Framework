# AltanTiS Framework

Under construction, install at your own risk 😔.

Usage:
```js
const { ExtendedClient } = require('./lib/index');

const client = new ExtendedClient({
    token: 'NTMxOTg3MTI2MTcxMDc0NTcx.XDPpng.0CFU7cpPDU9K9x9qqqh29ZBDjp4',
    prefix: '?',
    ownerIDS: ['515282559861653505']
});

client.once('ready', () => {
    console.log('Ready!');

    client.initCommand('say', (message, args) => {
        message.delete();
        message.channel.send(args.join(' ') || '** **');
    }, {
        requiresPermissions: {
            permissions: ['MANAGE_MESSAGES'],
            send: (message, _args) => {
                message.channel.send(`Missing permission **${client.nodeToName('MANAGE_MESSAGES')}**`);
            }
        },
        ownerOnly: false, // Default: false
        aliases: ['speak', 'echo'], // Default: []
        category: 'util', // Default: ''
        description: 'Speak as bot', // Default: ''
        usage: '?say {message}' // Default: ''
    });

    // You can even get a commmand by its usage, description, or category!

    client.commands.filter(command => command.category == 'util'); // Returns all commands in the category "util"
    client.commands.filter(command => command.ownerOnly); // Gets all commands which only the owner can use.
    // So on, so forth.
});

client.on('commandCreate', (command, callback) => {
    console.log(`Command ${command} has loaded!`);
});

client.authorize();
```
