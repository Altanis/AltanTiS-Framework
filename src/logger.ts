import colors from 'colors';
import moment from 'moment';

interface Options {
    throw?: boolean;
}

colors;

class Logger {
    log: Function;

    constructor() {
        this.log = console.log;
    }

    info(message: string) {
        this.log(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.blue);
    }

    severe(message: string, opts?: Options) {
        if (opts && opts.throw) {
            throw new Error(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.red);
        } else {
            this.log(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.red);
        }
        
    }

    warn(message: string) {
        this.log(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.yellow);
    }

    success(message: string) {
        this.log(`${moment().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.green);
    }
};

export { Logger };