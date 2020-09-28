import { Client, ClientOptions, Collection, Message, PartialMessage } from 'discord.js';
declare type CommandCallback = () => void;
interface ExtendedOptions extends ClientOptions {
    token: string;
    prefix: string;
    ownerID?: string;
}
export declare class ExtendedClient extends Client {
    token: string;
    prefix: string;
    ownerID: string | null;
    commands: Map<string, CommandCallback>;
    deletedMessages: Collection<string, Message | PartialMessage>;
    constructor(options: ExtendedOptions);
    /**
    * Initialize a command.
    * @param commandName - The name for the command being created.
    * @param callback - How the command runs when it's called.
    */
    initCommand(commandName: string, callback: CommandCallback): void;
    get registeredCommands(): string[];
    authorize(): void;
}
export {};
//# sourceMappingURL=bot.d.ts.map