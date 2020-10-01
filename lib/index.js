"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const colors = __importStar(require("colors"));
const moment_1 = __importDefault(require("moment"));
colors; // To compile the TSC file without manually needing to reimport colors in the compiled file.
;
let alreadyEmitted = [];
class ExtendedClient extends discord_js_1.Client {
    constructor(options) {
        super();
        /**
         * All deleted messages mapped by their ID.
         */
        this.deletedMessages = new discord_js_1.Collection();
        /**
         * An object containing their run function and properties mapped by their name.
         */
        this.commands = new discord_js_1.Collection();
        /**
         * The token of the bot.
         */
        this.token = options.token;
        /**
         * The prefix the bot replies to.
         */
        this.prefix = options.prefix;
        /**
         * The ID the bot replies to for owner commands.
         */
        this.ownerIDS = options.ownerIDS ? options.ownerIDS : null;
        if (!this.prefix)
            throw new Error('No prefix was provided into the client options.');
        if (!this.token)
            throw new Error('No token was provided into the client options.');
        this.once('ready', () => {
            if (this.user && !this.user.bot)
                throw new Error('AltaFramework does not support user bots. Please retry with a bot token.');
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
                    if (value) {
                        if (value.ownerOnly) {
                            if (!this.ownerIDS?.includes(message.author.id))
                                return;
                            value.run(message, args);
                        }
                        if (value.requiresPermissions && value.requiresPermissions[0]) {
                            let passable = undefined;
                            value.requiresPermissions.map(id => {
                                if (passable)
                                    return;
                                if (message.member?.permissions.has(id) == false)
                                    passable = false;
                                else
                                    passable = true;
                            });
                            if (!passable)
                                return;
                            value.run(message, args);
                        }
                        if (!value.ownerOnly && (!value.requiresPermissions?.length || !value.requiresPermissions)) {
                            value.run(message, args);
                        }
                    }
                }
                else {
                    let aliases = value.aliases;
                    if (!aliases)
                        return;
                    if (typeof cmd == 'string' && aliases.includes(cmd)) {
                        if (value) {
                            if (value.ownerOnly) {
                                if (!this.ownerIDS?.includes(message.author.id))
                                    return;
                                value.run(message, args);
                            }
                            if (value.requiresPermissions && value.requiresPermissions[0]) {
                                let passable = undefined;
                                value.requiresPermissions.map(id => {
                                    if (passable)
                                        return;
                                    if (message.member?.permissions.has(id) == false)
                                        passable = false;
                                    else
                                        passable = true;
                                });
                                if (!passable)
                                    return;
                                value.run(message, args);
                            }
                            if (!value.ownerOnly && (!value.requiresPermissions?.length || !value.requiresPermissions)) {
                                value.run(message, args);
                            }
                        }
                    }
                }
            }
        });
    }
    /**
    * Initialize a command.
    * @param commandName - The name for the command being created.
    * @param callback - How the command runs when it's called.
    * @param options - The options for the command.
    */
    initCommand(commandName, callback, options) {
        const curObject = {
            ownerOnly: options?.ownerOnly,
            requiresPermissions: options?.requiresPermissions,
            aliases: options?.aliases,
            category: options?.category,
            description: options?.description,
            usage: options?.usage,
            run: callback,
        };
        if (typeof curObject.ownerOnly == 'undefined') {
            delete curObject.ownerOnly;
        }
        else if (typeof curObject.requiresPermissions == 'undefined') {
            delete curObject.requiresPermissions;
        }
        else if (typeof curObject.aliases == 'undefined') {
            delete curObject.aliases;
        }
        else if (typeof curObject.category == 'undefined') {
            delete curObject.category;
        }
        else if (typeof curObject.description == 'undefined') {
            delete curObject.description;
        }
        else if (typeof curObject.usage == 'undefined') {
            delete curObject.usage;
        }
        this.commands.set(commandName, curObject);
        if (alreadyEmitted.includes(commandName))
            return;
        this.emit('commandCreate', commandName, callback);
        alreadyEmitted.push(commandName);
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
//# sourceMappingURL=index.js.map