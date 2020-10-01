import { Client, ClientOptions, Collection, Message, PartialMessage, BitFieldResolvable, PermissionString } from 'discord.js';
declare type CommandCallback = (message: Message, args: string[]) => void;
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
}
export declare class ExtendedClient extends Client {
    token: string;
    prefix: string;
    ownerIDS: string[] | null;
    commands: Map<string, CommandObject>;
    deletedMessages: Collection<string, Message | PartialMessage>;
    constructor(options: ExtendedOptions);
    /**
    * Initialize a command.
    * @param commandName - The name for the command being created.
    * @param callback - How the command runs when it's called.
    * @param options - The options for the command.
    */
    initCommand(commandName: string, callback: CommandCallback, options?: CommandOptions): void;
    /**
     * Get the names of every registered commmand.
     */
    get registeredCommands(): string[];
    /**
     * Connects the WebSocket to the client.
     */
    authorize(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map