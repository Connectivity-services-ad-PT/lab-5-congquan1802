"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openIdConnect = exports.oauth2 = exports.bearer = void 0;
const Option_1 = require("fp-ts/Option");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const bearerHandler = (msg, input) => (0, utils_1.when)(isBearerToken(input.headers || {}), msg);
function isBearerToken(inputHeaders) {
    return (0, function_1.pipe)((0, Option_1.fromNullable)((0, lodash_1.get)(inputHeaders, 'authorization')), (0, Option_1.map)(authorization => !!/^Bearer\s.+$/.exec(authorization)), (0, Option_1.getOrElse)(() => false));
}
exports.bearer = (0, lodash_1.partial)(bearerHandler, 'Bearer');
exports.oauth2 = (0, lodash_1.partial)(bearerHandler, 'OAuth2');
exports.openIdConnect = (0, lodash_1.partial)(bearerHandler, 'OpenID');
