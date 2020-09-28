'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require('discord.js');
const moment_1 = require('moment');
const _colors = require('colors');

class ExtendedClient extends discord_js_1.Client {
    constructor(options) {
        super();
        this.deletedMessages = new discord_js_1.Collection();
        this.commands = new Map();
        this.token = options.token;
        this.prefix = options.prefix;
        this.ownerID = options.ownerID ? options.ownerID : null;
        if (!this.prefix)
            throw new Error('No prefix was provided into the client options.');
        if (!this.token)
            throw new Error('No token was provided into the client options.');
        this.once('ready', () => {
            /* tslint:disable:no-console */
            console.log(`${moment_1().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: AltaFramework has successfully loaded.`.green);
        });
        this.on('messageDelete', (message) => this.deletedMessages.set(message.id, message));
        this.on('message', async (message) => {
            if (!message.content.startsWith(this.prefix) || message.author.bot)
                return;
            const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
            const cmd = args.shift()?.toLowerCase();
            for (const [key, value] of this.commands) {
                if (cmd === key) {
                    value();
                }
            }
        });
    }
    /**
    * Initialize a command.
    * @param commandName - The name for the command being created.
    * @param callback - How the command runs when it's called.
    */
    initCommand(commandName, callback) {
        this.commands.set(commandName, callback);
        callback();
        this.emit('commandCreate', commandName, callback);
    }
    /**
     * Get the names of every registered commmand.
     */
    get registeredCommands() {
        const commands = [];
        for (const [key, _value] of this.commands) {
            commands.push(key);
        }
        return commands;
    }
    /**
     * Connects the WebSocket to the client.
     */
    authorize() {
        this.login(this.token);
    }
}
exports.ExtendedClient = ExtendedClient;
;
//# sourceMappingURL=bot.js.map