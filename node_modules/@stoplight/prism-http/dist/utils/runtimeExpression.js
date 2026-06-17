"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRuntimeExpression = exports.resolveRuntimeExpressions = void 0;
const O = require("fp-ts/Option");
const Array_1 = require("fp-ts/Array");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const json_1 = require("@stoplight/json");
function resolveRuntimeExpressions(input, request, response) {
    return input.replace(/{(.+?)}/g, (_, expr) => (0, function_1.pipe)(resolveRuntimeExpression(expr, request, response), O.getOrElse(() => '')));
}
exports.resolveRuntimeExpressions = resolveRuntimeExpressions;
function resolveRuntimeExpression(expr, request, response) {
    const parts = expr.split(/[.#]/);
    return (0, function_1.pipe)(tryMethod(), O.alt(tryStatusCode), O.alt(() => (0, function_1.pipe)(isPart(0, '$request'), O.chain(() => (0, function_1.pipe)(tryRequestHeader(), O.alt(tryRequestQuery), O.alt(tryRequestBody))))), O.alt(() => (0, function_1.pipe)(isPart(0, '$response'), O.chain(() => (0, function_1.pipe)(tryResponseHeader(), O.alt(tryResponseBody))))));
    function isPart(idx, type) {
        return (0, function_1.pipe)((0, Array_1.lookup)(idx, parts), O.chain(O.fromPredicate(part => part === type)));
    }
    function tryMethod() {
        return (0, function_1.pipe)(isPart(0, '$method'), O.map(() => String(request.method)));
    }
    function tryStatusCode() {
        return (0, function_1.pipe)(isPart(0, '$statusCode'), O.map(() => String(response.statusCode)));
    }
    function tryRequestHeader() {
        return (0, function_1.pipe)(isPart(1, 'header'), O.chain(() => (0, Array_1.lookup)(2, parts)), O.chain(part => (0, function_1.pipe)(O.fromNullable(request.headers), O.chainNullableK(headers => headers[part]))));
    }
    function tryRequestQuery() {
        return (0, function_1.pipe)(isPart(1, 'query'), O.bind('query', () => O.fromNullable(request.url.query)), O.bind('part', () => (0, Array_1.lookup)(2, parts)), O.chain(({ part, query }) => O.fromNullable(query[part])));
    }
    function tryRequestBody() {
        return (0, function_1.pipe)(isPart(1, 'body'), O.chain(() => readBody(request.body)));
    }
    function tryResponseHeader() {
        return (0, function_1.pipe)(isPart(1, 'header'), O.chain(() => (0, Array_1.lookup)(2, parts)), O.chain(part => (0, function_1.pipe)(O.fromNullable(response.headers), O.chainNullableK(headers => headers[part]))));
    }
    function tryResponseBody() {
        return (0, function_1.pipe)(isPart(1, 'body'), O.chain(() => readBody(response.body)));
    }
    function readBody(body) {
        return (0, function_1.pipe)(O.Do, O.bind('body', () => O.fromNullable(body)), O.bind('path', () => (0, function_1.pipe)((0, Array_1.lookup)(2, parts), O.chain(part => O.tryCatch(() => (0, json_1.pointerToPath)('#' + part))))), O.chain(({ body, path }) => O.fromNullable((0, lodash_1.get)(body, path))));
    }
}
exports.resolveRuntimeExpression = resolveRuntimeExpression;
