# AltanTiS Framework

Under construction, install at your own risk 😔.

Usage:
```js
const { ExtendedClient } = require('./lib/index');

const client = new ExtendedClient({
    token: 'token',
    prefix: '?',
    ownerIDS: ['515282559861653505']
});

client.once('ready', () => {
    console.log('Ready!');

    client.initCommand('say', (message, args) => {
        message.delete();
        message.channel.send(args.join(' ') || '** **');
    }, {
        requiresPermissions: ['MANAGE_MESSAGES'], // Default: []
        ownerOnly: false, // Default: false
        aliases: ['speak', 'echo'], // Default: []
        category: 'util', // Default: ''
        description: 'Speak as bot', // Default: ''
        usage: '>say {message}' // Default: ''
    });

    client.commands.find('ping')
});

client.on('commandCreate', (command, callback) => {
    console.log(`Command ${command} has loaded!`);
});

client.authorize();
```