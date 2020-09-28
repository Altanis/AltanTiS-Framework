# AltanTiS Framework

Under construction, install at your own risk 😔.

Usage:
```js
const { ExtendedClient } = require('discord.js');
const client = new ExtendedClient({
    token: 'valid-token',
    prefix: '??',
    ownerID: '4748939589039040',
});

client.once('ready', () => {
    console.log('[META][INFO]: Bot initialized.');
});

client.on('error', console.error);

client.on('commandCreate', async (commandName, commandCallback) => {
    console.log(`Command ${commandName} has been loaded.`);

    // You can even get the command outside of the commandCreate event too!
    console.log(client.commands.get(commandName)); // returns commandCallback
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(client.prefix)) return;

    const args = message.content.split(' ').slice(1);

    client.initCommand('say', () => {
        const argument = args.join(' ') || '** **';
        message.delete();
        message.channel.send(argument);
    });
});

client.authorize();
```