import { Client, ClientOptions, Collection, Message, PartialMessage, BitFieldResolvable, PermissionString, MessageEmbed, TextChannel, DMChannel } from 'discord.js';
import * as colors from 'colors';
import moment from 'moment';

colors; // To compile the TSC file without manually needing to reimport colors in the compiled file.

import { Logger } from './logger'; 

const log = new Logger();

type CommandCallback = (message: Message, args: string[]) => void;

interface ExtendedOptions extends ClientOptions {
	token: string;
	prefix: string;
	ownerIDS?: string[];
}

interface CommandOptions {
	ownerOnly?: boolean;
	requiresPermissions?: Array<BitFieldResolvable<PermissionString>>;
	aliases?: string[];
	category?: string;
	description?: string;
	usage?: string;
}

interface CommandObject {
	ownerOnly?: boolean;
	requiresPermissions?: Array<BitFieldResolvable<PermissionString>>;
	aliases?: string[];
	category?: string;
	description?: string;
	usage?: string;
	run: CommandCallback;
};

let alreadyEmitted: string[] = [];

declare module 'discord.js' {
	interface ClientEvents {
		commandCreate: [ string, CommandCallback ];
	}
}

export class ExtendedClient extends Client {
	public token: string;
	public prefix: string;
	public ownerIDS: string[]|null;
	public commands: Collection<string, CommandObject>;
	public events: Collection<string, any>;
	public deletedMessages: Collection<string, Message | PartialMessage>;
	
	constructor(options: ExtendedOptions) {
		super();
		
		this.deletedMessages = new Collection();
		this.commands = new Collection();
		this.events = new Collection();
		this.token = options.token;
		this.prefix = options.prefix;
		this.ownerIDS = options.ownerIDS ? options.ownerIDS : null;

		if (!this.prefix) log.severe('No prefix was provided into the client options.', { throw: true });
		if (!this.token) log.severe('No token was provided into the client options.', { throw: true });
		
		this.once('ready', () => {
			if (this.user && !this.user.bot) return log.severe('AltaFramework does not support user bots. Please retry with a bot token.', { throw: true });
			/* tslint:disable:no-console */
			log.success('AltaFramework has successfully loaded.');
		});
		
		this.on('messageDelete', (message) => this.deletedMessages.set(message.id, message));
		
		this.on('message', async (message) => {
			if (!message.content.startsWith(this.prefix) || message.author.bot) return;
			
			const args: string[] = message.content.slice(this.prefix.length).trim().split(/ +/g);
			const cmd: string | undefined = args.shift()?.toLowerCase();
			
			for (const [key, value] of this.commands) {
				if (cmd === key) {
					if (value) {
						if (value.ownerOnly) {
							if (!this.ownerIDS?.includes(message.author.id)) return;
	
							value.run(message, args);
						}
						
						if (value.requiresPermissions && value.requiresPermissions[0]) {
							let passable: boolean | undefined = undefined;
							
							value.requiresPermissions.map(id => {
								if (passable) return;
								if (message.member?.permissions.has(id) == false) passable = false;
								else passable = true;
							});
							
							if (!passable) return;

							value.run(message, args);
						}

						if (!value.ownerOnly && ( !value.requiresPermissions?.length || !value.requiresPermissions) ) {
							value.run(message, args);
						}
					}
				} else {
					let aliases = value.aliases;
					
					if (!aliases) return;

					if (typeof cmd == 'string' && aliases.includes(cmd)) {
						if (value) {
							if (value.ownerOnly) {
								if (!this.ownerIDS?.includes(message.author.id)) return;
		
								value.run(message, args);
							}
							
							if (value.requiresPermissions && value.requiresPermissions[0]) {
								let passable: boolean | undefined = undefined;
								
								value.requiresPermissions.map(id => {
									if (passable) return;
									if (message.member?.permissions.has(id) == false) passable = false;
									else passable = true;
								});
								
								if (!passable) return;
	
								value.run(message, args);
							}
	
							if (!value.ownerOnly && ( !value.requiresPermissions?.length || !value.requiresPermissions) ) {
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
	
	public initCommand(commandName: string, callback: CommandCallback, options?: CommandOptions): void {
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
		} else if (typeof curObject.requiresPermissions == 'undefined') {
			delete curObject.requiresPermissions;
		} else if (typeof curObject.aliases == 'undefined') {
			delete curObject.aliases;
		} else if (typeof curObject.category == 'undefined') {
			delete curObject.category;
		} else if (typeof curObject.description == 'undefined') {
			delete curObject.description;
		} else if (typeof curObject.usage == 'undefined') {
			delete curObject.usage;
		}

		this.commands.set(commandName, curObject);
		if (alreadyEmitted.includes(commandName)) return;
		this.emit('commandCreate', commandName, callback);
		alreadyEmitted.push(commandName);
	}
	
    /**
     * Get the names of every registered commmand.
     */
	public get registeredCommands(): string[] {
		const commands: string[] = [];
		
		for (const [key, _value] of this.commands) {
			commands.push(key);
		}
		
		return commands;
	}

	/**
     * Connects the WebSocket to the client.
     */
	public authorize(): void {
		this.login(this.token);
	}
};