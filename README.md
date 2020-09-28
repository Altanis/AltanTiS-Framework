# AltanTiS Framework

Under construction, install at your own risk 😔.

Usage:
```js
const { ExtendedClient } = require('altantis-framework');

const client = new ExtendedClient({
    token: 'NzU0NzQwNDc2NzUzNzM5Nzk2.X15I2A.Kiq4AR9KuJDzkrDn3UT0SYlzofM',
    prefix: '?',
});

client.once('ready', () => {
    console.log('[META][INFO]: Bot initialized.');

    client.initCommand('say', async (message, args) => {
        const argument = args.join(' ') || '** **';
        message.delete();
        message.channel.send(argument);
    });
});
 
client.on('error', console.error);
 
client.on('commandCreate', async (commandName, _commandCallback) => {
    console.log(`Command ${commandName} has been loaded.`);
});

client.authorize();
```