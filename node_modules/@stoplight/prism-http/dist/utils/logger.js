"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logResponse = exports.logRequest = exports.logBody = exports.logHeaders = exports.violationLogger = void 0;
const withLogger_1 = require("../withLogger");
const types_1 = require("@stoplight/types");
const function_1 = require("fp-ts/lib/function");
const Option = require("fp-ts/lib/Option");
const chalk = require("chalk");
const forwarder_1 = require("../forwarder");
exports.violationLogger = (0, withLogger_1.default)(logger => {
    return (violation) => {
        const path = violation.path ? violation.path.join('.') + ' ' : '';
        const message = `Violation: ${path}${violation.message}`;
        if (violation.severity === types_1.DiagnosticSeverity.Error) {
            logger.error({ name: 'VALIDATOR' }, message);
        }
        else if (violation.severity === types_1.DiagnosticSeverity.Warning) {
            logger.warn({ name: 'VALIDATOR' }, message);
        }
        else {
            logger.info({ name: 'VALIDATOR' }, message);
        }
    };
});
function logHeaders({ logger, prefix = '', headers, }) {
    (0, function_1.pipe)((0, function_1.pipe)(headers, Option.fromPredicate((headers) => Array.isArray(headers))), Option.alt(() => Option.some(Object.entries(headers))), Option.map(headers => {
        logger.debug(`${prefix}${chalk.grey('Headers:')}`);
        headers.forEach(([name, value]) => logger.debug(`${prefix}\t${name}: ${value}`));
    }));
}
exports.logHeaders = logHeaders;
function logBody({ logger, prefix = '', body }) {
    (0, function_1.pipe)((0, forwarder_1.serializeBody)(body), Option.fromEither, Option.fold(() => undefined, body => logger.debug(`${prefix}${chalk.grey('Body:')} ${body}`)));
}
exports.logBody = logBody;
function logRequest({ logger, prefix = '', headers, body, }) {
    (0, function_1.pipe)(Option.fromNullable(headers), Option.map(headers => logHeaders({
        logger,
        prefix,
        headers,
    })));
    (0, function_1.pipe)(Option.fromNullable(body), Option.map(body => logBody({
        logger,
        prefix,
        body,
    })));
}
exports.logRequest = logRequest;
function logResponse({ logger, prefix = '', statusCode, headers, body, }) {
    logger.debug(`${prefix}${chalk.grey('Status:')} ${statusCode}`);
    (0, function_1.pipe)(Option.fromNullable(headers), Option.map(headers => logHeaders({ logger, prefix, headers })));
    (0, function_1.pipe)(Option.fromNullable(body), Option.map(body => logBody({
        logger,
        prefix,
        body,
    })));
}
exports.logResponse = logResponse;
