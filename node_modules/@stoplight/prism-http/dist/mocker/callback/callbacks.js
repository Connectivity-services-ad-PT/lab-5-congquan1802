"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCallback = void 0;
const runtimeExpression_1 = require("../../utils/runtimeExpression");
const node_fetch_1 = require("node-fetch");
const chalk = require("chalk");
const E = require("fp-ts/Either");
const O = require("fp-ts/Option");
const A = require("fp-ts/Array");
const TE = require("fp-ts/TaskEither");
const J = require("fp-ts/Json");
const Array_1 = require("fp-ts/Array");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const HttpParamGenerator_1 = require("../generator/HttpParamGenerator");
const validator_1 = require("../../validator");
const parseResponse_1 = require("../../utils/parseResponse");
const logger_1 = require("../../utils/logger");
function runCallback({ callback, request, response, }) {
    return logger => {
        const { url, requestData } = assembleRequest({ resource: callback, request, response });
        const logViolation = (0, logger_1.violationLogger)(logger);
        logCallbackRequest({ logger, callbackName: callback.key, url, requestData });
        return (0, function_1.pipe)(TE.tryCatch(() => (0, node_fetch_1.default)(url, requestData), E.toError), TE.chain(parseResponse_1.parseResponse), TE.map(callbackResponseLogger({ logger, callbackName: callback.key })), TE.mapLeft(error => logger.error(`${chalk.blueBright(callback.key + ':')} Request failed: ${error.message}`)), TE.chainEitherK(element => {
            return (0, function_1.pipe)((0, validator_1.validateOutput)({ resource: callback, element }), E.mapLeft(violations => {
                (0, function_1.pipe)(violations, A.map(logViolation));
            }));
        }));
    };
}
exports.runCallback = runCallback;
function logCallbackRequest({ logger, url, callbackName, requestData, }) {
    const prefix = `${chalk.blueBright(callbackName + ':')} ${chalk.grey('> ')}`;
    logger.info(`${prefix}Executing "${requestData.method}" callback to ${url}...`);
    (0, logger_1.logRequest)({ logger, prefix, ...(0, lodash_1.pick)(requestData, 'body', 'headers') });
}
function callbackResponseLogger({ logger, callbackName }) {
    const prefix = `${chalk.blueBright(callbackName + ':')} ${chalk.grey('< ')}`;
    return (response) => {
        logger.info(`${prefix}Received callback response`);
        (0, logger_1.logResponse)({ logger, prefix, ...(0, lodash_1.pick)(response, 'body', 'headers', 'statusCode') });
        return response;
    };
}
function assembleRequest({ resource, request, response, }) {
    const bodyAndMediaType = O.toUndefined(assembleBody(resource.request));
    return {
        url: (0, runtimeExpression_1.resolveRuntimeExpressions)(resource.path, request, response),
        requestData: {
            headers: O.toUndefined(assembleHeaders(resource.request, bodyAndMediaType === null || bodyAndMediaType === void 0 ? void 0 : bodyAndMediaType.mediaType)),
            body: bodyAndMediaType === null || bodyAndMediaType === void 0 ? void 0 : bodyAndMediaType.body,
            method: resource.method,
        },
    };
}
function assembleBody(request) {
    var _a;
    return (0, function_1.pipe)(O.fromNullable((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.contents), O.bind('content', contents => (0, Array_1.head)(contents)), O.bind('body', ({ content }) => (0, HttpParamGenerator_1.generate)(content)), O.chain(({ body, content: { mediaType } }) => (0, function_1.pipe)(J.stringify(body), E.map(body => ({ body, mediaType })), O.fromEither)));
}
const assembleHeaders = (request, bodyMediaType) => (0, function_1.pipe)(O.fromNullable(request === null || request === void 0 ? void 0 : request.headers), O.chain(O.traverseArray(param => (0, function_1.pipe)((0, HttpParamGenerator_1.generate)(param), O.map(value => [param.name, value])))), O.reduce((0, function_1.pipe)(O.fromNullable(bodyMediaType), O.map(mediaType => ({ 'content-type': mediaType }))), (mediaTypeHeader, headers) => ({ ...headers, ...mediaTypeHeader })));
