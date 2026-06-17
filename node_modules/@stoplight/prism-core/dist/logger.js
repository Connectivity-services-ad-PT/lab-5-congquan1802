"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const pino = require("pino");
const lodash_1 = require("lodash");
function createLogger(name, overrideOptions = {}, destination) {
    const options = (0, lodash_1.defaultsDeep)(overrideOptions, {
        name,
        base: {},
        customLevels: {
            success: pino.levels.values['info'] + 2,
        },
        level: 'success',
        timestamp: false,
    });
    if (destination)
        return pino(options, destination);
    return pino(options);
}
exports.createLogger = createLogger;
