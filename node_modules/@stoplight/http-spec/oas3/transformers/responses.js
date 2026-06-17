"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToResponses = exports.translateToResponse = void 0;
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
const utils_1 = require("../../utils");
const guards_3 = require("../guards");
const content_1 = require("./content");
const headers_1 = require("./headers");
exports.translateToResponse = (0, context_1.withContext)(function ([statusCode, response]) {
    var _a;
    const maybeResponseObject = (_a = this.maybeResolveLocalRef(response)) !== null && _a !== void 0 ? _a : response;
    if ((0, guards_2.isReferenceObject)(maybeResponseObject)) {
        maybeResponseObject.code = statusCode;
        return maybeResponseObject;
    }
    if (!(0, guards_3.isResponseObject)(maybeResponseObject))
        return;
    const codeOrKey = this.context === 'service' ? (0, resolver_1.getSharedKey)(maybeResponseObject, statusCode) : statusCode;
    return {
        id: this.generateId.httpResponse({ codeOrKey }),
        code: statusCode,
        headers: (0, utils_1.entries)(maybeResponseObject.headers).map(headers_1.translateHeaderObject, this).filter(guards_1.isNonNullable),
        contents: (0, utils_1.entries)(maybeResponseObject.content).map(content_1.translateMediaTypeObject, this).filter(guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            description: maybeResponseObject.description,
        }, guards_1.isString),
    };
});
const translateToResponses = function (responses) {
    return (0, utils_1.entries)(responses).map(exports.translateToResponse, this).filter(guards_1.isNonNullable);
};
exports.translateToResponses = translateToResponses;
//# sourceMappingURL=responses.js.map