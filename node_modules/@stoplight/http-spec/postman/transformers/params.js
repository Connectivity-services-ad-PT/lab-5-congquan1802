"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformRawBody = exports.transformBody = exports.transformPathParams = exports.transformHeader = exports.transformQueryParam = void 0;
const jsonSchemaGenerator = require("@stoplight/json-schema-generator");
const types_1 = require("@stoplight/types");
const typeIs = require("type-is");
const schema_1 = require("../../oas/transformers/schema");
const id_1 = require("../id");
const util_1 = require("../util");
function transformQueryParam(queryParam) {
    return {
        id: (0, id_1.generateId)(),
        name: queryParam.key || '',
        style: types_1.HttpParamStyles.Form,
        required: true,
        ...(queryParam.value ? (0, util_1.transformStringValueToSchema)(queryParam.value) : undefined),
    };
}
exports.transformQueryParam = transformQueryParam;
function transformHeader(header) {
    return {
        id: (0, id_1.generateId)(),
        name: header.key.toLowerCase(),
        style: types_1.HttpParamStyles.Simple,
        required: true,
        ...(header.value ? (0, util_1.transformStringValueToSchema)(header.value) : undefined),
    };
}
exports.transformHeader = transformHeader;
function transformPathParams(segments) {
    return segments.reduce((params, segment) => {
        if (segment.startsWith(':')) {
            params.push({
                id: (0, id_1.generateId)(),
                name: segment.substring(1),
                style: types_1.HttpParamStyles.Simple,
                required: true,
            });
        }
        return params;
    }, []);
}
exports.transformPathParams = transformPathParams;
function transformBody(body, mediaType) {
    switch (body.mode) {
        case 'raw':
            if (!body.raw)
                return;
            return { id: (0, id_1.generateId)(), contents: [transformRawBody(body.raw, mediaType)] };
        case 'formdata':
            if (!body.formdata)
                return;
            return {
                id: (0, id_1.generateId)(),
                contents: [transformParamsBody(body.formdata, mediaType || 'multipart/form-data')],
            };
        case 'urlencoded':
            if (!body.urlencoded)
                return;
            return {
                id: (0, id_1.generateId)(),
                contents: [transformParamsBody(body.urlencoded, mediaType || 'application/x-www-form-urlencoded')],
            };
    }
    return;
}
exports.transformBody = transformBody;
function transformRawBody(raw, mediaType = 'text/plain') {
    if (typeIs.is(mediaType, ['application/json', 'application/*+json'])) {
        try {
            const parsed = JSON.parse(raw);
            return {
                id: (0, id_1.generateId)(),
                mediaType,
                examples: [
                    {
                        id: (0, id_1.generateId)(),
                        key: 'default',
                        value: parsed,
                    },
                ],
                schema: (0, schema_1.convertSchema)({}, jsonSchemaGenerator(parsed)),
            };
        }
        catch (e) {
        }
    }
    return {
        id: (0, id_1.generateId)(),
        mediaType,
        examples: [
            {
                id: (0, id_1.generateId)(),
                key: 'default',
                value: raw,
            },
        ],
    };
}
exports.transformRawBody = transformRawBody;
function transformParamsBody(params, mediaType) {
    const paramsList = params.map(item => {
        return {
            name: item.key || (0, id_1.generateId)(),
            schema: {
                type: 'string',
                description: item.description && (0, util_1.transformDescriptionDefinition)(item.description),
            },
            value: item.value,
        };
    });
    return {
        id: (0, id_1.generateId)(),
        mediaType,
        schema: {
            type: 'object',
            properties: paramsList.reduce((props, param) => {
                props[param.name] = param.schema;
                return props;
            }, {}),
        },
        examples: [
            {
                id: (0, id_1.generateId)(),
                key: 'default',
                value: paramsList.reduce((values, param) => {
                    values[param.name] = param.value;
                    return values;
                }, {}),
            },
        ],
    };
}
//# sourceMappingURL=params.js.map