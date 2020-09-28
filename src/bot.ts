import { Client, ClientOptions, Collection, Message, PartialMessage } from 'discord.js';
import * as _colors from 'colors';
import moment from 'moment';

type CommandCallback = () => void;

interface ExtendedOptions extends ClientOptions {
	token: string;
	prefix: string;
	ownerID?: string;
}

export class ExtendedClient extends Client {
	token: string;
	prefix: string;
	ownerID: string | null;
	commands: Map<string, CommandCallback>;
	deletedMessages: Collection<string, Message | PartialMessage>;
	
	constructor(options: ExtendedOptions) {
		super();
		
		this.deletedMessages = new Collection();
		this.commands = new Map();
		
		this.token = options.token;
		this.prefix = options.prefix;
		this.ownerID = options.ownerID ? options.ownerID : null;
		
		if (!this.prefix) throw new Error('No prefix was provided into the client options.');
		if (!this.token) throw new Error('No token was provided into the client options.');
		
		this.once('ready', () => {
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
	
	initCommand(commandName: string, callback: CommandCallback): void {
		this.commands.set(commandName, callback);
		callback();
		this.emit('commandCreate', commandName, callback);
	}
	
	get registeredCommands(): string[] {
		const commands: string[] = [];
		
		for (const [key, _value] of this.commands) {
			commands.push(key);
		}
		
		return commands;
	}
	
	authorize(): void {
		this.login(this.token);
	}
};