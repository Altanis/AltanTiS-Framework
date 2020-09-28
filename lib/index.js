"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
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
            console.log(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: AltaFramework has successfully loaded.`.green);
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
    get registeredCommands() {
        const commands = [];
        for (const [key, _value] of this.commands) {
            commands.push(key);
        }
        return commands;
    }
    authorize() {
        this.login(this.token);
    }
}
exports.ExtendedClient = ExtendedClient;
;
//# sourceMappingURL=bot.js.map