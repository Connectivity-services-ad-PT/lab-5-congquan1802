"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_COLOR_MAP = void 0;
const chalk = require("chalk");
exports.LOG_COLOR_MAP = {
    CLI: { index: 0, color: chalk.bgWhiteBright },
    'HTTP SERVER': { index: 0, color: chalk.bgYellowBright },
    NEGOTIATOR: { index: 1, color: chalk.bgCyanBright },
    VALIDATOR: { index: 1, color: chalk.bgGreenBright },
    CALLBACK: { index: 1, color: chalk.bgBlue },
    PROXY: { index: 1, color: chalk.bgMagentaBright },
};
