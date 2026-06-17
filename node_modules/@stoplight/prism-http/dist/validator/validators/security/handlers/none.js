"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.none = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
function isNoAuth(inputHeaders) {
    return (0, lodash_1.get)(inputHeaders, 'authorization') == undefined;
}
const none = (input) => (0, utils_1.when)(isNoAuth(input.headers || {}), 'None');
exports.none = none;
