"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.findContentByMediaTypeOrFirst = exports.decodeUriEntities = exports.parseMultipartFormDataParams = exports.splitUriParams = exports.deserializeFormBody = void 0;
const types_1 = require("@stoplight/types");
const A = require("fp-ts/Array");
const E = require("fp-ts/Either");
const O = require("fp-ts/Option");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const multipart = require("parse-multipart-data");
const type_is_1 = require("type-is");
const deserializers_1 = require("../deserializers");
const utils_1 = require("./utils");
const types_2 = require("./types");
const mergeAllOf = require("@stoplight/json-schema-merge-allof");
const filterRequiredProperties_1 = require("../../utils/filterRequiredProperties");
const wildcardMediaTypeMatch_1 = require("../utils/wildcardMediaTypeMatch");
function deserializeFormBody(schema, encodings, decodedUriParams) {
    if (!schema.properties) {
        return E.right(decodedUriParams);
    }
    function parseBrokenJSONArray(inputArray) {
        let parsedJSONObjects = [];
        let currentJSONObject = "";
        for (let item of inputArray) {
            currentJSONObject += (currentJSONObject.length > 0 ? "," : "") + item;
            try {
                const parsed = JSON.parse(currentJSONObject);
                parsedJSONObjects.push(parsed);
                currentJSONObject = "";
            }
            catch (_) { }
        }
        return [parsedJSONObjects, currentJSONObject];
    }
    return (0, function_1.pipe)(Object.keys(schema.properties), (properties) => {
        var _a;
        const deserialized = {};
        for (let property of properties) {
            deserialized[property] = decodedUriParams[property];
            const encoding = encodings.find(enc => enc.property === property);
            if (encoding && encoding.style) {
                const deserializer = deserializers_1.body[encoding.style];
                const propertySchema = (_a = schema.properties) === null || _a === void 0 ? void 0 : _a[property];
                if (propertySchema && typeof propertySchema !== 'boolean') {
                    let deserializedValues = deserializer(property, decodedUriParams, propertySchema, encoding.explode);
                    const items = propertySchema.items;
                    if (Array.isArray(deserializedValues) && typeof items === "object" && items['type'] === 'object') {
                        const [parsedValues, unparsedJSONString] = parseBrokenJSONArray(deserializedValues);
                        if (unparsedJSONString.length > 0) {
                            return E.left([
                                {
                                    message: `Cannot deserialize JSON object array in form data request body. Make sure the array is in JSON`,
                                    code: 415,
                                    severity: types_1.DiagnosticSeverity.Error,
                                },
                            ]);
                        }
                        else {
                            deserializedValues = parsedValues;
                        }
                    }
                    deserialized[property] = deserializedValues;
                }
            }
        }
        return E.right(deserialized);
    });
}
exports.deserializeFormBody = deserializeFormBody;
function splitUriParams(target) {
    return E.right(target.split('&').reduce((result, pair) => {
        const [key, ...rest] = pair.split('=');
        result[key] = rest.join('=');
        return result;
    }, {}));
}
exports.splitUriParams = splitUriParams;
function parseMultipartFormDataParams(target, multipartBoundary) {
    if (!multipartBoundary) {
        const error = 'Boundary parameter for multipart/form-data is not defined or generated in the request header. Try removing manually defined content-type from your request header if it exists.';
        return E.left([
            {
                message: error,
                code: 415,
                severity: types_1.DiagnosticSeverity.Error,
            },
        ]);
    }
    const bufferBody = Buffer.from(target, 'utf-8');
    const parts = multipart.parse(bufferBody, multipartBoundary);
    return E.right(parts.reduce((result, pair) => {
        result[pair['name']] = pair['data'].toString();
        return result;
    }, {}));
}
exports.parseMultipartFormDataParams = parseMultipartFormDataParams;
function decodeUriEntities(target, mediaType) {
    return Object.entries(target).reduce((result, [k, v]) => {
        try {
            if ((0, type_is_1.is)(mediaType, 'application/x-www-form-urlencoded')) {
                v = v.replaceAll('+', '%20');
            }
            result[decodeURIComponent(k)] = decodeURIComponent(v);
        }
        catch (e) {
            result[decodeURIComponent(k)] = v;
        }
        return result;
    }, {});
}
exports.decodeUriEntities = decodeUriEntities;
function findContentByMediaTypeOrFirst(specs, mediaType) {
    return (0, function_1.pipe)(specs, A.findFirst(spec => (0, wildcardMediaTypeMatch_1.wildcardMediaTypeMatch)(mediaType, spec.mediaType)), O.alt(() => A.head(specs)), O.map(content => ({ mediaType, content })));
}
exports.findContentByMediaTypeOrFirst = findContentByMediaTypeOrFirst;
function deserializeAndValidate(content, schema, target, context, prefix, multipartBoundary, bundle) {
    const encodings = (0, lodash_1.get)(content, 'encodings', []);
    return (0, function_1.pipe)(content.mediaType === 'multipart/form-data'
        ? parseMultipartFormDataParams(target, multipartBoundary)
        : splitUriParams(target), E.chain(encodedUriParams => validateAgainstReservedCharacters(encodedUriParams, encodings, prefix)), E.map(target => decodeUriEntities(target, content.mediaType)), E.chain(decodedUriEntities => deserializeFormBody(schema, encodings, decodedUriEntities)), E.chain(deserialised => (0, function_1.pipe)((0, utils_1.validateAgainstSchema)(deserialised, schema, true, context, prefix, bundle), E.fromOption(() => deserialised), E.swap)));
}
function withoutAllOf(s) {
    try {
        return mergeAllOf(s, {
            deep: true,
            ignoreAdditionalProperties: true,
        });
    }
    catch (_a) {
        return s;
    }
}
function memoizeSchemaNormalizer(normalizer) {
    const cache = new WeakMap();
    return (schema) => {
        const cached = cache.get(schema);
        if (!cached) {
            const after = withoutAllOf(schema);
            const newSchema = normalizer(after);
            cache.set(schema, newSchema);
            return newSchema;
        }
        return cached;
    };
}
const normalizeSchemaProcessorMap = {
    [types_2.ValidationContext.Input]: memoizeSchemaNormalizer(filterRequiredProperties_1.stripReadOnlyProperties),
    [types_2.ValidationContext.Output]: memoizeSchemaNormalizer(filterRequiredProperties_1.stripWriteOnlyProperties),
};
const validate = (target, specs, context, mediaType, multipartBoundary, bundle) => {
    const findContentByMediaType = (0, function_1.pipe)(O.Do, O.bind('mediaType', () => O.fromNullable(mediaType)), O.bind('contentResult', ({ mediaType }) => findContentByMediaTypeOrFirst(specs, mediaType)), O.alt(() => O.some({ contentResult: { content: specs[0] || {}, mediaType: 'random' } })), O.bind('schema', ({ contentResult }) => (0, function_1.pipe)(O.fromNullable(contentResult.content.schema), O.chain(normalizeSchemaProcessorMap[context]))));
    const prefix = 'body';
    return (0, function_1.pipe)(findContentByMediaType, O.fold(() => E.right(target), ({ contentResult: { content, mediaType: mt }, schema }) => (0, function_1.pipe)(mt, O.fromPredicate(mediaType => !!(0, type_is_1.is)(mediaType, ['application/x-www-form-urlencoded', 'multipart/form-data'])), O.fold(() => (0, function_1.pipe)((0, utils_1.validateAgainstSchema)(target, schema, false, context, prefix, bundle), E.fromOption(() => target), E.swap), () => (0, function_1.pipe)(target, E.fromPredicate((target) => typeof target === 'string', () => [{ message: 'Target is not a string', code: '422', severity: types_1.DiagnosticSeverity.Error }]), E.chain(target => deserializeAndValidate(content, schema, target, context, prefix, multipartBoundary)))))));
};
exports.validate = validate;
function validateAgainstReservedCharacters(encodedUriParams, encodings, prefix) {
    return (0, function_1.pipe)(encodings, A.reduce([], (diagnostics, encoding) => {
        const allowReserved = (0, lodash_1.get)(encoding, 'allowReserved', false);
        const property = encoding.property;
        const value = encodedUriParams[property];
        if (!allowReserved && /[/?#[\]@!$&'()*+,;=]/.test(value)) {
            diagnostics.push({
                path: prefix ? [prefix, property] : [property],
                message: 'Reserved characters used in request body',
                severity: types_1.DiagnosticSeverity.Error,
            });
        }
        return diagnostics;
    }), diagnostics => (A.isNonEmpty(diagnostics) ? E.left(diagnostics) : E.right(encodedUriParams)));
}
