import { Client, ClientOptions, Collection, Message, PartialMessage, BitFieldResolvable, PermissionString } from 'discord.js';
import * as colors from 'colors';
import moment from 'moment';

colors; // To compile the TSC file without manually needing to reimport colors in the compiled file.

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


export class ExtendedClient extends Client {
	public token: string;
	public prefix: string;
	public ownerIDS: string[]|null;
	public commands: Map<string, CommandObject>;
	public deletedMessages: Collection<string, Message | PartialMessage>;
	
	constructor(options: ExtendedOptions) {
		super();
		
		/**
		 * All deleted messages mapped by their ID.
		 */
		this.deletedMessages = new Collection();
		/**
		 * An object containing their run function and properties mapped by their name.
		 */
		this.commands = new Collection();
		
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

		if (!this.prefix) throw new Error('No prefix was provided into the client options.');
		if (!this.token) throw new Error('No token was provided into the client options.');
		
		this.once('ready', () => {
			if (this.user && !this.user.bot) throw new Error('AltaFramework does not support user bots. Please retry with a bot token.');
			/* tslint:disable:no-console */
			console.log(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: AltaFramework has successfully loaded.`.green);
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