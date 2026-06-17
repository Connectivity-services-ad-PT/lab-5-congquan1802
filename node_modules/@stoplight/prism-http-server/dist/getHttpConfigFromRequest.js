"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpConfigFromRequest = void 0;
const prism_http_1 = require("@stoplight/prism-http");
const function_1 = require("fp-ts/function");
const E = require("fp-ts/Either");
const D = require("io-ts/lib/Decoder");
const parsePreferHeader = require("parse-prefer-header");
const BooleanFromString = D.parse(s => s === 'true' ? D.success(true) : s === 'false' ? D.success(false) : D.failure(s, 'a boolean'));
const IntegerFromString = D.parse(s => {
    return /^\d{3}$/.test(s) ? D.success(parseInt(s, 10)) : D.failure(s, 'a number');
});
const PreferencesDecoder = D.partial({
    code: (0, function_1.pipe)(D.string, IntegerFromString),
    dynamic: (0, function_1.pipe)(D.string, BooleanFromString),
    seed: D.string,
    example: D.string,
});
const getHttpConfigFromRequest = (req) => {
    var _a, _b, _c, _d;
    const preferences = req.headers && req.headers['prefer']
        ? parsePreferHeader(req.headers['prefer'])
        : {
            code: (_a = req.url.query) === null || _a === void 0 ? void 0 : _a.__code,
            dynamic: (_b = req.url.query) === null || _b === void 0 ? void 0 : _b.__dynamic,
            seed: (_c = req.url.query) === null || _c === void 0 ? void 0 : _c.__seed,
            example: (_d = req.url.query) === null || _d === void 0 ? void 0 : _d.__example,
        };
    return (0, function_1.pipe)(PreferencesDecoder.decode(preferences), E.bimap(err => prism_http_1.ProblemJsonError.fromTemplate(prism_http_1.UNPROCESSABLE_ENTITY, D.draw(err)), parsed => ({ code: parsed === null || parsed === void 0 ? void 0 : parsed.code, exampleKey: parsed === null || parsed === void 0 ? void 0 : parsed.example, dynamic: parsed === null || parsed === void 0 ? void 0 : parsed.dynamic, seed: parsed === null || parsed === void 0 ? void 0 : parsed.seed })));
};
exports.getHttpConfigFromRequest = getHttpConfigFromRequest;
