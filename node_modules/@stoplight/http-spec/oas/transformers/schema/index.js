"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSchema = exports.translateSchemaObjectFromPair = exports.translateSchemaObject = void 0;
const json_1 = require("@stoplight/json");
const context_1 = require("../../../context");
const utils_1 = require("../../../utils");
const guards_1 = require("../../guards");
const resolver_1 = require("../../resolver");
const keywords_1 = require("./keywords");
const keywordsKeys = Object.keys(keywords_1.default);
const PROCESSED_SCHEMAS = new WeakMap();
exports.translateSchemaObject = (0, context_1.withContext)(function (schema) {
    const maybeSchemaObject = this.maybeResolveLocalRef(schema);
    if ((0, guards_1.isReferenceObject)(maybeSchemaObject))
        return maybeSchemaObject;
    const actualKey = this.context === 'service' ? (0, resolver_1.getSharedKey)(Object(maybeSchemaObject), '') : '';
    return exports.translateSchemaObjectFromPair.call(this, [actualKey, schema]);
});
exports.translateSchemaObjectFromPair = (0, context_1.withContext)(function ([key, schema]) {
    var _a, _b;
    const maybeSchemaObject = this.maybeResolveLocalRef(schema);
    if (!(0, json_1.isPlainObject)(maybeSchemaObject)) {
        if (!(0, guards_1.isReferenceObject)(schema))
            return {};
        const converted = convertSchema(this.document, schema, this.references);
        const id = (_a = (0, utils_1.extractId)(converted)) !== null && _a !== void 0 ? _a : this.generateId.schema({ key: key !== null && key !== void 0 ? key : '' });
        converted['x-stoplight'] = {
            ...((0, json_1.isPlainObject)(converted['x-stoplight']) && converted['x-stoplight']),
            id,
        };
        return converted;
    }
    if ((0, guards_1.isReferenceObject)(maybeSchemaObject))
        return maybeSchemaObject;
    let cached = PROCESSED_SCHEMAS.get(maybeSchemaObject);
    if (cached) {
        return cached;
    }
    cached = convertSchema(this.document, maybeSchemaObject, this.references);
    const id = (_b = (0, utils_1.extractId)(cached)) !== null && _b !== void 0 ? _b : this.generateId.schema({ key: key !== null && key !== void 0 ? key : '' });
    cached['x-stoplight'] = {
        ...((0, json_1.isPlainObject)(cached['x-stoplight']) && cached['x-stoplight']),
        id,
    };
    PROCESSED_SCHEMAS.set(maybeSchemaObject, cached);
    return cached;
});
function convertSchema(document, schema, references = {}) {
    const actualSchema = (0, json_1.isPlainObject)(schema) ? schema : {};
    if ('jsonSchemaDialect' in document && typeof document.jsonSchemaDialect === 'string') {
        return {
            $schema: document.jsonSchemaDialect,
            ...actualSchema,
        };
    }
    const clonedSchema = _convertSchema(actualSchema, {
        structs: ['allOf', 'anyOf', 'oneOf', 'not', 'items', 'additionalProperties', 'additionalItems'],
        references,
    });
    clonedSchema.$schema = 'http://json-schema.org/draft-07/schema#';
    return clonedSchema;
}
exports.convertSchema = convertSchema;
function _convertSchema(schema, options) {
    if ((0, guards_1.isReferenceObject)(schema)) {
        return (0, resolver_1.syncReferenceObject)(schema, options.references);
    }
    let processedSchema = PROCESSED_SCHEMAS.get(schema);
    if (processedSchema) {
        return processedSchema;
    }
    const clonedSchema = { ...schema };
    PROCESSED_SCHEMAS.set(schema, clonedSchema);
    for (const struct of options.structs) {
        if (Array.isArray(clonedSchema[struct])) {
            clonedSchema[struct] = clonedSchema[struct].slice();
            for (let i = 0; i < clonedSchema[struct].length; i++) {
                if (typeof clonedSchema[struct][i] === 'object' && clonedSchema[struct][i] !== null) {
                    clonedSchema[struct][i] = _convertSchema(clonedSchema[struct][i], options);
                }
                else {
                    clonedSchema[struct].splice(i, 1);
                    i--;
                }
            }
        }
        else if (clonedSchema[struct] !== null && typeof clonedSchema[struct] === 'object') {
            clonedSchema[struct] = _convertSchema(clonedSchema[struct], options);
        }
    }
    if ('properties' in clonedSchema && (0, json_1.isPlainObject)(clonedSchema.properties)) {
        convertProperties(clonedSchema, options);
    }
    for (const keyword of keywordsKeys) {
        if (keyword in clonedSchema) {
            keywords_1.default[keyword](clonedSchema);
        }
    }
    return clonedSchema;
}
function convertProperties(schema, options) {
    const props = { ...schema.properties };
    schema.properties = props;
    for (const key of Object.keys(props)) {
        const property = props[key];
        if ((0, json_1.isPlainObject)(property)) {
            props[key] = _convertSchema(property, options);
        }
    }
}
//# sourceMappingURL=index.js.map