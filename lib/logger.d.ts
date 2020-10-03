interface Options {
    throw?: boolean;
}
declare class Logger {
    log: Function;
    constructor();
    info(message: string): void;
    severe(message: string, opts?: Options): void;
    warn(message: string): void;
    success(message: string): void;
}
export { Logger };
//# sourceMappingURL=logger.d.ts.map