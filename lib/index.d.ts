import { Client, ClientOptions, Collection, Message, PartialMessage, BitFieldResolvable, PermissionString } from 'discord.js';
declare type CommandCallback = (message: Message, args: string[]) => void;
declare type SendCallback = (message: Message, args: string[]) => void;
declare type CooldownSendCallback = (message: Message, args: string[], time: string) => void;
interface ExtendedOptions extends ClientOptions {
    token: string;
    prefix: string;
    ownerIDS?: string[];
}
interface CooldownObject {
    cooldown: number;
    send?: CooldownSendCallback;
}
interface PermissionsObject {
    permissions: Array<BitFieldResolvable<PermissionString>>;
    send?: SendCallback;
}
interface CommandOptions {
    ownerOnly?: boolean;
    requiresPermissions?: PermissionsObject;
    aliases?: string[];
    category?: string;
    description?: string;
    usage?: string;
    restrictBot?: boolean;
    cooldown?: CooldownObject;
}
interface CommandObject {
    ownerOnly?: boolean;
    requiresPermissions?: PermissionsObject;
    aliases?: string[];
    category?: string;
    description?: string;
    usage?: string;
    restrictBot?: boolean;
    cooldown?: CooldownObject;
    run: CommandCallback;
}
declare module 'discord.js' {
    interface ClientEvents {
        commandCreate: [string, CommandCallback];
    }
}
export declare class ExtendedClient extends Client {
    /**
     * The token of the client.
     */
    token: string;
    /**
     * The prefix of the client.
     */
    prefix: string;
    /**
     * The array of owner IDs.
     */
    ownerIDS: string[] | null;
    /**
     * A collection of CommandObjects mapped by their name.
     */
    commands: Collection<string, CommandObject>;
    /**
     *
     */
    cooldown: Map<string, {
        [key: string]: {
            currentCooldown: number;
            baseCooldown: number;
        };
    }>;
    /**
     * A collection of deleted messages mapped by their ID.
     */
    deletedMessages: Collection<string, Message | PartialMessage>;
    constructor(options: ExtendedOptions);
    delay(delay: number): Promise<void>;
    /**
     * Convert a permission node to a name of a permission on Discord.
     * @param permissionNode - The permission node to convert to a more user-friendly permission name.
     */
    nodeToName(permissionNode: string): string;
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