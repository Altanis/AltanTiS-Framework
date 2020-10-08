# AltanTiS Framework

Under construction, install at your own risk 😔.

Usage:

## Option 1:
```js
const { ExtendedClient } = require('altantis-framework');

const client = new ExtendedClient({
    token: 'very-valid-token',
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
        cooldown: {
            cooldown: 4,
            send: (message, args, time) => {
                message.channel.send(`You need to wait **${time}** before this command can be run again.`)
            }, 
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

client.on('commandCreate', (command, _callback) => {
    console.log(`Command ${command} has loaded!`);
});

client.authorize();
```

## Option 2:

```js
// index.js
const { ExtendedClient } = require('altantis-framework');

const client = new ExtendedClient({
    token: 'very-valid-token',
    prefix: '?',
    ownerIDS: ['515282559861653505']
});

client.once('ready', () => {
    console.log('Ready!');

    client.initCommand('./say');
});

client.on('commandCreate', (command, _callback) => {
    console.log(`Command ${command} has loaded!`);
});

client.authorize();

// say.js
module.exports = {
    requiresPermissions: {
        permissions: ['MANAGE_MESSAGES'],
        send: (message, _args) => message.channel.send('You do not have the permission `Manage Messages`.'),
    },
    cooldown: {
        cooldown: 5000, // Cannot be below 150 (milliseconds)
        send: (message, args, time) => {
            message.channel.send(`You need to wait **${time}** before this command can be run again.`)
        }, 
    },
    aliases: ['speak', 'echo'],
    run: (message, args) => {
        message.delete();
        message.channel.send(args.join(' ') || '** **');
    },
};
```