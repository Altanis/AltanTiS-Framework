"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const colors_1 = __importDefault(require("colors"));
const moment_1 = __importDefault(require("moment"));
colors_1.default;
class Logger {
    constructor() {
        this.log = console.log;
    }
    info(message) {
        this.log(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.blue);
    }
    severe(message, opts) {
        if (opts && opts.throw) {
            throw new Error(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.red);
        }
        else {
            this.log(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.red);
        }
    }
    warn(message) {
        this.log(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.yellow);
    }
    success(message) {
        this.log(`${moment_1.default().format('MM/DD/YYYY hh:mm:ss a').toUpperCase().bold}: ${message}`.green);
    }
}
exports.Logger = Logger;
;
//# sourceMappingURL=logger.js.map