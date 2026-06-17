"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.when = exports.isScheme = exports.genUnauthorisedErr = exports.genRespForScheme = void 0;
const types_1 = require("@stoplight/types");
const E = require("fp-ts/Either");
const function_1 = require("fp-ts/function");
const function_2 = require("fp-ts/function");
const genRespForScheme = (isSchemeProper, isCredsGiven, msg) => (0, function_1.pipe)(isSchemeProper, E.fromPredicate(function_2.identity, () => (0, exports.genUnauthorisedErr)(msg)), E.chain(() => (0, exports.when)(isCredsGiven, undefined)));
exports.genRespForScheme = genRespForScheme;
const genUnauthorisedErr = (msg) => ({
    severity: types_1.DiagnosticSeverity.Error,
    message: 'Invalid security scheme used',
    code: 401,
    tags: msg ? [msg] : [],
});
exports.genUnauthorisedErr = genUnauthorisedErr;
function isScheme(shouldBeScheme, authScheme) {
    return authScheme.toLowerCase() === shouldBeScheme;
}
exports.isScheme = isScheme;
const when = (condition, errorMessage) => (0, function_1.pipe)(condition, E.fromPredicate(function_2.identity, () => (0, exports.genUnauthorisedErr)(errorMessage)));
exports.when = when;
