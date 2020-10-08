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
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
colors; // To compile the TSC file without manually needing to reimport colors in the compiled file.
const logger_1 = require("./logger");
const log = new logger_1.Logger();
;
let alreadyEmitted = [];
class ExtendedClient extends discord_js_1.Client {
    constructor(options) {
        super();
        this.deletedMessages = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.token = options.token;
        this.prefix = options.prefix;
        this.ownerIDS = options.ownerIDS ? options.ownerIDS : null;
        this.cooldown = new Map();
        if (!this.prefix)
            log.severe('No prefix was provided into the client options.', { throw: true });
        if (!this.token)
            log.severe('No token was provided into the client options.', { throw: true });
        this.once('ready', () => {
            if (this.user && !this.user.bot)
                return log.severe('AltaFramework does not support user bots. Please retry with a bot token.', { throw: true });
            /* tslint:disable:no-console */
            log.success('AltaFramework has successfully loaded.');
            this.setInterval(() => {
                if (!this.cooldown.size) {
                    let object = {};
                    this.guilds.cache.forEach(guild => {
                        for (let [key, value] of this.commands) {
                            object[key] = {
                                currentCooldown: 0,
                                baseCooldown: value.cooldown?.cooldown ? value.cooldown.cooldown : 0,
                            };
                        }
                        this.cooldown.set(guild.id, object);
                    });
                }
                for (let [k, value] of this.cooldown) {
                    const keys = Object.keys(value);
                    keys.map(key => {
                        let { currentCooldown, baseCooldown } = value[key];
                        if (baseCooldown <= 150)
                            return log.severe('Sorry, but cooldowns must be above 150 milliseconds for AltaFramework to process it. You inputted ' + baseCooldown + ' milliseconds.', { throw: false });
                        if (currentCooldown !== 0) {
                            let newCooldown = currentCooldown - 1000;
                            value[key] = {
                                currentCooldown: newCooldown,
                                baseCooldown: baseCooldown,
                            };
                            this.cooldown.set(k, value);
                        }
                    });
                }
            }, 1000);
        });
        this.on('messageDelete', (message) => this.deletedMessages.set(message.id, message));
        this.on('message', async (message) => {
            if (!message.content.startsWith(this.prefix))
                return;
            const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
            const cmd = args.shift()?.toLowerCase();
            for (const [key, value] of this.commands) {
                if (cmd === key) {
                    if (value) {
                        let passable = true;
                        if (value.ownerOnly) {
                            if (!this.ownerIDS?.includes(message.author.id))
                                return passable = false;
                        }
                        if (value.cooldown) {
                            console.log(this.cooldown);
                            if (!message.guild)
                                return;
                            if (typeof this.cooldown.get(message.guild.id) == 'undefined')
                                return;
                            let cooldown = this.cooldown.get(message.guild.id)?.[key];
                            if (cooldown?.currentCooldown) {
                                passable = false;
                                value.cooldown.send?.(message, args, pretty_ms_1.default(cooldown.currentCooldown, {
                                    verbose: true,
                                }));
                            }
                        }
                        if (value.requiresPermissions && value.requiresPermissions.permissions[0]) {
                            let passableArray = [];
                            let scopePassable = true;
                            value.requiresPermissions.permissions.map(id => {
                                if (!message.member?.permissions.has(id))
                                    passableArray.push(false);
                                else
                                    passableArray.push(true);
                            });
                            passableArray.map(element => {
                                if (!element)
                                    scopePassable = false;
                            });
                            if (!scopePassable) {
                                passable = false;
                                value.requiresPermissions?.send?.(message, args);
                            }
                        }
                        if (passable) {
                            value.run(message, args);
                            if (!message.guild)
                                return;
                            const commands = this.cooldown.get(message.guild.id);
                            if (!commands)
                                return;
                            const specificCommand = this.cooldown.get(message.guild.id)?.[key];
                            if (!specificCommand?.currentCooldown && specificCommand?.currentCooldown !== 0)
                                return;
                            specificCommand.currentCooldown = specificCommand?.baseCooldown;
                            commands[key] = specificCommand;
                            this.cooldown.set(message.guild.id, commands);
                        }
                    }
                }
                else {
                    let aliases = value.aliases;
                    if (!aliases)
                        return;
                    if (typeof cmd == 'string' && aliases.includes(cmd)) {
                        if (value) {
                            let passable = true;
                            if (value.ownerOnly) {
                                if (!this.ownerIDS?.includes(message.author.id))
                                    return passable = false;
                            }
                            if (value.cooldown) {
                                if (!message.guild)
                                    return;
                                if (typeof this.cooldown.get(message.guild.id) == 'undefined')
                                    return;
                                let cooldown = this.cooldown.get(message.guild.id)?.[key];
                                if (cooldown?.currentCooldown) {
                                    passable = false;
                                    value.cooldown.send?.(message, args, pretty_ms_1.default(cooldown.currentCooldown, {
                                        verbose: true,
                                    }));
                                }
                            }
                            if (value.requiresPermissions && value.requiresPermissions.permissions[0]) {
                                let passableArray = [];
                                let scopePassable = true;
                                value.requiresPermissions.permissions.map(id => {
                                    if (!message.member?.permissions.has(id))
                                        passableArray.push(false);
                                    else
                                        passableArray.push(true);
                                });
                                passableArray.map(element => {
                                    if (!element)
                                        scopePassable = false;
                                });
                                if (!scopePassable) {
                                    passable = false;
                                    value.requiresPermissions?.send?.(message, args);
                                }
                            }
                            if (passable)
                                value.run(message, args);
                        }
                    }
                }
            }
        });
    }
    async delay(delay) {
        return new Promise((res, rej) => setTimeout(res, delay));
    }
    /**
     * Convert a permission node to a name of a permission on Discord.
     * @param permissionNode - The permission node to convert to a more user-friendly permission name.
     */
    nodeToName(permissionNode) {
        if (permissionNode == 'MANAGE_GUILD')
            return 'Manage Server';
        let split = permissionNode.split('_');
        let str = '';
        split.map(element => {
            const reformed = `${element.charAt(0).toUpperCase()}${element.slice(1).toLowerCase()} `;
            str += reformed;
        });
        return str;
    }
    /**
    * Initialize a command.
    * @param commandName - The name for the command being created.
    * @param callback - How the command runs when it's called.
    * @param options - The options for the command.
    */
    initCommand(commandName, callback, options) {
        if (!fs_extra_1.default.existsSync(`${app_root_path_1.default}/${commandName}`)) {
            const curObject = {
                ownerOnly: options?.ownerOnly,
                requiresPermissions: options?.requiresPermissions,
                aliases: options?.aliases,
                category: options?.category,
                description: options?.description,
                usage: options?.usage,
                restrictBot: options?.restrictBot,
                cooldown: options?.cooldown,
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
            else if (typeof curObject.restrictBot == 'undefined') {
                delete curObject.usage;
            }
            this.commands.set(commandName, curObject);
            if (alreadyEmitted.includes(commandName))
                return;
            this.emit('commandCreate', commandName, callback);
            alreadyEmitted.push(commandName);
        }
        else {
            const props = require(`${app_root_path_1.default}/${commandName}`);
            const cmdName = commandName.replace(app_root_path_1.default.toString(), '').replace('./', '').split('.')[0];
            this.commands.set(cmdName, props);
            if (alreadyEmitted.includes(cmdName))
                return;
            this.emit('commandCreate', cmdName, callback);
            alreadyEmitted.push(cmdName);
        }
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