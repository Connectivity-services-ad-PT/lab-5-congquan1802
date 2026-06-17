"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReferenceObject = exports.isValidOas3ParamStyle = exports.isValidOas3ParameterObject = exports.isValidOas2ParameterObject = exports.isValidParameterObject = exports.hasXLogo = void 0;
const json_1 = require("@stoplight/json");
const types_1 = require("@stoplight/types");
function hasXLogo(info) {
    return (0, json_1.isPlainObject)(info['x-logo']);
}
exports.hasXLogo = hasXLogo;
const VALID_OAS3_PARAM_LOCATION = ['query', 'header', 'path', 'cookie'];
const VALID_OAS2_PARAM_LOCATION = ['query', 'header', 'path', 'body', 'formData'];
const VALID_OAS3_PARAM_STYLES = Object.values(types_1.HttpParamStyles).filter(s => ![types_1.HttpParamStyles.CommaDelimited, types_1.HttpParamStyles.TabDelimited].includes(s));
const isValidParameterObject = (param) => (0, json_1.isPlainObject)(param) && typeof param.name === 'string' && typeof param.in === 'string';
exports.isValidParameterObject = isValidParameterObject;
const isValidOas2ParameterObject = (param) => (0, exports.isValidParameterObject)(param) && VALID_OAS2_PARAM_LOCATION.includes(param.in);
exports.isValidOas2ParameterObject = isValidOas2ParameterObject;
const isValidOas3ParameterObject = (param) => (0, exports.isValidParameterObject)(param) && VALID_OAS3_PARAM_LOCATION.includes(param.in);
exports.isValidOas3ParameterObject = isValidOas3ParameterObject;
const isValidOas3ParamStyle = (style) => VALID_OAS3_PARAM_STYLES.includes(style);
exports.isValidOas3ParamStyle = isValidOas3ParamStyle;
function isReferenceObject(maybeReferenceObject) {
    return (0, json_1.hasRef)(maybeReferenceObject);
}
exports.isReferenceObject = isReferenceObject;
//# sourceMappingURL=guards.js.map