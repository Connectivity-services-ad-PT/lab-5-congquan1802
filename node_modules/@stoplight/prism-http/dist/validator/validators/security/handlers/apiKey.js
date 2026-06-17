"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyInQuery = exports.apiKeyInHeader = exports.apiKeyInCookie = void 0;
const Option_1 = require("fp-ts/Option");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const apiKeyInCookie = (input, name) => {
    var _a;
    const isApiKeyInCookie = (0, function_1.pipe)((0, Option_1.fromNullable)((_a = input.headers) === null || _a === void 0 ? void 0 : _a['cookie']), (0, Option_1.map)(cookie => new RegExp(`${(0, lodash_1.escapeRegExp)(name)}=.+`).test(cookie)), (0, Option_1.getOrElse)(() => false));
    return (0, utils_1.when)(isApiKeyInCookie, undefined);
};
exports.apiKeyInCookie = apiKeyInCookie;
const apiKeyInHeader = (input, name) => {
    const isAPIKeyProvided = (0, lodash_1.get)(input, ['headers', name.toLowerCase()]);
    return (0, utils_1.when)(!!isAPIKeyProvided, undefined);
};
exports.apiKeyInHeader = apiKeyInHeader;
const apiKeyInQuery = (input, name) => {
    const isApiKeyInQuery = (0, lodash_1.get)(input, ['url', 'query', name]);
    return (0, utils_1.when)(isApiKeyInQuery, undefined);
};
exports.apiKeyInQuery = apiKeyInQuery;
