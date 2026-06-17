"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = exports.parseResponseHeaders = exports.parseResponseBody = void 0;
const type_is_1 = require("type-is");
const E = require("fp-ts/Either");
const TE = require("fp-ts/TaskEither");
const lodash_1 = require("lodash");
const function_1 = require("fp-ts/function");
const parseResponseBody = (response) => TE.tryCatch(() => (response.status != 204 && (0, type_is_1.is)(response.headers.get('content-type') || '', ['application/json', 'application/*+json']))
    ? response.json()
    : response.text(), E.toError);
exports.parseResponseBody = parseResponseBody;
const parseResponseHeaders = (headers) => (0, lodash_1.mapValues)(headers, hValue => hValue.join(','));
exports.parseResponseHeaders = parseResponseHeaders;
const parseResponse = (response) => (0, function_1.pipe)((0, exports.parseResponseBody)(response), TE.map(body => ({
    statusCode: response.status,
    headers: (0, exports.parseResponseHeaders)(response.headers.raw()),
    body,
})));
exports.parseResponse = parseResponse;
