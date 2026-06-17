"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSharedResponses = exports.translateToResponses = exports.translateToResponse = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
const examples_1 = require("../../oas/transformers/examples");
const schema_1 = require("../../oas/transformers/schema");
const utils_1 = require("../../utils");
const accessors_1 = require("../accessors");
const guards_3 = require("../guards");
const params_1 = require("./params");
exports.translateToResponse = (0, context_1.withContext)(function (produces, statusCode, response) {
    var _a;
    const maybeResponseObject = (_a = this.maybeResolveLocalRef(response)) !== null && _a !== void 0 ? _a : response;
    if ((0, guards_2.isReferenceObject)(maybeResponseObject)) {
        maybeResponseObject.code = statusCode;
        return maybeResponseObject;
    }
    if (!(0, guards_3.isResponseObject)(maybeResponseObject))
        return;
    const codeOrKey = this.context === 'service' ? (0, resolver_1.getSharedKey)(maybeResponseObject, statusCode) : statusCode;
    const id = this.generateId.httpResponse({ codeOrKey, produces });
    const headers = params_1.translateToHeaderParams.call(this, maybeResponseObject.headers);
    const objectifiedExamples = (0, utils_1.entries)(maybeResponseObject.examples || (0, accessors_1.getExamplesFromSchema)(maybeResponseObject.schema)).map(([key, value]) => examples_1.translateToDefaultExample.call(this, key, value));
    const contents = produces
        .map((0, context_1.withContext)(produceElement => {
        return {
            id: this.generateId.httpMedia({ mediaType: produceElement }),
            mediaType: produceElement,
            examples: objectifiedExamples.filter(example => example.key === produceElement),
            ...(0, lodash_1.pickBy)({
                schema: (0, json_1.isPlainObject)(maybeResponseObject.schema)
                    ? schema_1.translateSchemaObject.call(this, maybeResponseObject.schema)
                    : undefined,
            }, guards_1.isNonNullable),
        };
    }), this)
        .filter(({ schema, examples }) => !!schema || examples.length > 0);
    const translatedResponse = {
        id,
        code: statusCode,
        description: maybeResponseObject.description,
        headers,
        contents,
    };
    const foreignExamples = objectifiedExamples.filter(example => !produces.includes(example.key));
    if (foreignExamples.length > 0) {
        if (translatedResponse.contents.length === 0)
            translatedResponse.contents[0] = {
                id: this.generateId.httpMedia({ mediaType: '' }),
                mediaType: '',
                schema: {},
                examples: [],
            };
        translatedResponse.contents[0].examples.push(...foreignExamples);
    }
    return translatedResponse;
});
const translateToResponses = function (operation) {
    const produces = (0, accessors_1.getProduces)(this.document, operation);
    return (0, utils_1.entries)(operation.responses)
        .map(([statusCode, response]) => exports.translateToResponse.call(this, produces, statusCode, response))
        .filter(guards_1.isNonNullable);
};
exports.translateToResponses = translateToResponses;
const translateToSharedResponses = function (root) {
    const sharedResponses = {
        responses: [],
    };
    for (const [key, value] of (0, utils_1.entries)(root.responses)) {
        (0, resolver_1.setSharedKey)(value, key);
        sharedResponses.responses.push({
            key,
            ...exports.translateToResponse.call(this, ['application/x-stoplight-placeholder'], key, value),
        });
    }
    return sharedResponses;
};
exports.translateToSharedResponses = translateToSharedResponses;
//# sourceMappingURL=responses.js.map