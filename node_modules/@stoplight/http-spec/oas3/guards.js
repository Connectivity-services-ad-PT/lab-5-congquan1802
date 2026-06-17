"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequestBodyObject = exports.isOAuthFlowObject = exports.isResponseObject = exports.isServerVariableObject = exports.isServerObject = exports.isHeaderObject = exports.isBaseParameterObject = exports.isSecurityScheme = void 0;
const json_1 = require("@stoplight/json");
const isSecurityScheme = (maybeSecurityScheme) => (0, json_1.isPlainObject)(maybeSecurityScheme) && typeof maybeSecurityScheme.type === 'string';
exports.isSecurityScheme = isSecurityScheme;
const isBaseParameterObject = (maybeBaseParameterObject) => (0, json_1.isPlainObject)(maybeBaseParameterObject) &&
    ('description' in maybeBaseParameterObject ||
        'required' in maybeBaseParameterObject ||
        'content' in maybeBaseParameterObject ||
        'style' in maybeBaseParameterObject ||
        'examples' in maybeBaseParameterObject ||
        'example' in maybeBaseParameterObject ||
        'schema' in maybeBaseParameterObject ||
        'name' in maybeBaseParameterObject);
exports.isBaseParameterObject = isBaseParameterObject;
const isHeaderObject = (maybeHeaderObject) => (0, exports.isBaseParameterObject)(maybeHeaderObject);
exports.isHeaderObject = isHeaderObject;
const isServerObject = (maybeServerObject) => (0, json_1.isPlainObject)(maybeServerObject) && typeof maybeServerObject.url === 'string';
exports.isServerObject = isServerObject;
const isServerVariableObject = (maybeServerVariableObject) => {
    if (!(0, json_1.isPlainObject)(maybeServerVariableObject))
        return false;
    const typeofDefault = typeof maybeServerVariableObject.default;
    return typeofDefault === 'string' || typeofDefault === 'boolean' || typeofDefault === 'number';
};
exports.isServerVariableObject = isServerVariableObject;
const isResponseObject = (maybeResponseObject) => (0, json_1.isPlainObject)(maybeResponseObject) &&
    ('description' in maybeResponseObject ||
        'headers' in maybeResponseObject ||
        'content' in maybeResponseObject ||
        'links' in maybeResponseObject);
exports.isResponseObject = isResponseObject;
const isOAuthFlowObject = (maybeOAuthFlowObject) => (0, json_1.isPlainObject)(maybeOAuthFlowObject) && (0, json_1.isPlainObject)(maybeOAuthFlowObject.scopes);
exports.isOAuthFlowObject = isOAuthFlowObject;
const isRequestBodyObject = (maybeRequestBodyObject) => (0, json_1.isPlainObject)(maybeRequestBodyObject) && (0, json_1.isPlainObject)(maybeRequestBodyObject.content);
exports.isRequestBodyObject = isRequestBodyObject;
//# sourceMappingURL=guards.js.map