"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateMediaTypeObject = void 0;
const json_1 = require("@stoplight/json");
const types_1 = require("@stoplight/types");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const examples_1 = require("../../oas/transformers/examples");
const schema_1 = require("../../oas/transformers/schema");
const utils_1 = require("../../utils");
const examples_2 = require("./examples");
const headers_1 = require("./headers");
const ACCEPTABLE_STYLES = [
    types_1.HttpParamStyles.Form,
    types_1.HttpParamStyles.SpaceDelimited,
    types_1.HttpParamStyles.PipeDelimited,
    types_1.HttpParamStyles.DeepObject,
];
function hasAcceptableStyle(encodingPropertyObject) {
    return typeof encodingPropertyObject.style === 'string' && ACCEPTABLE_STYLES.includes(encodingPropertyObject.style);
}
const translateEncodingPropertyObject = (0, context_1.withContext)(function ([property, encodingPropertyObject]) {
    if (!(0, json_1.isPlainObject)(encodingPropertyObject))
        return;
    if (!hasAcceptableStyle(encodingPropertyObject))
        return;
    return {
        property,
        style: encodingPropertyObject.style,
        headers: (0, utils_1.entries)(encodingPropertyObject.headers).map(headers_1.translateHeaderObject, this).filter(guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            allowReserved: encodingPropertyObject.allowReserved,
            explode: encodingPropertyObject.explode,
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            mediaType: encodingPropertyObject.contentType,
        }, guards_1.isString),
    };
});
const translateSchemaMediaTypeObject = (0, context_1.withContext)(function (schema) {
    if (!(0, json_1.isPlainObject)(schema))
        return;
    return schema_1.translateSchemaObject.call(this, schema);
});
exports.translateMediaTypeObject = (0, context_1.withContext)(function ([mediaType, mediaObject]) {
    var _a;
    if (!(0, json_1.isPlainObject)(mediaObject))
        return;
    const id = this.generateId.httpMedia({ mediaType });
    const { schema, encoding, examples } = mediaObject;
    const jsonSchema = translateSchemaMediaTypeObject.call(this, schema);
    const defaultExample = 'example' in mediaObject ? mediaObject.example : (_a = jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.examples) === null || _a === void 0 ? void 0 : _a[0];
    return {
        id,
        mediaType,
        examples: [
            defaultExample !== undefined ? examples_1.translateToDefaultExample.call(this, 'default', defaultExample) : undefined,
            ...(0, utils_1.entries)(examples).map(examples_2.translateToExample, this),
        ].filter(guards_1.isNonNullable),
        encodings: (0, utils_1.entries)(encoding).map(translateEncodingPropertyObject, this).filter(guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            schema: jsonSchema,
        }, guards_1.isNonNullable),
    };
});
//# sourceMappingURL=content.js.map