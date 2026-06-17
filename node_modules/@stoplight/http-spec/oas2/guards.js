"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormDataParam = exports.isBodyParam = exports.isHeaderParam = exports.isPathParam = exports.isQueryParam = exports.isValidScheme = exports.isResponseObject = exports.isSecurityScheme = void 0;
const json_1 = require("@stoplight/json");
const guards_1 = require("../oas/guards");
function isSecurityScheme(maybeSecurityScheme) {
    return (0, json_1.isPlainObject)(maybeSecurityScheme) && typeof maybeSecurityScheme.type === 'string';
}
exports.isSecurityScheme = isSecurityScheme;
const isResponseObject = (maybeResponseObject) => (0, json_1.isPlainObject)(maybeResponseObject) &&
    ('description' in maybeResponseObject ||
        'schema' in maybeResponseObject ||
        'headers' in maybeResponseObject ||
        'examples' in maybeResponseObject);
exports.isResponseObject = isResponseObject;
function isValidScheme(scheme) {
    return typeof scheme === 'string' && ['http', 'https', 'ws', 'wss'].includes(scheme);
}
exports.isValidScheme = isValidScheme;
function isQueryParam(param) {
    return (0, guards_1.isValidOas2ParameterObject)(param) && param.in === 'query';
}
exports.isQueryParam = isQueryParam;
function isPathParam(param) {
    return (0, guards_1.isValidOas2ParameterObject)(param) && param.in === 'path';
}
exports.isPathParam = isPathParam;
function isHeaderParam(param) {
    return (0, guards_1.isValidOas2ParameterObject)(param) && param.in === 'header';
}
exports.isHeaderParam = isHeaderParam;
function isBodyParam(param) {
    return (0, guards_1.isValidOas2ParameterObject)(param) && param.in === 'body';
}
exports.isBodyParam = isBodyParam;
function isFormDataParam(param) {
    return (0, guards_1.isValidOas2ParameterObject)(param) && param.in === 'formData';
}
exports.isFormDataParam = isFormDataParam;
//# sourceMappingURL=guards.js.map