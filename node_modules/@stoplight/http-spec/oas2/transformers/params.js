"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSharedParameters = exports.translateToPathParameter = exports.translateToQueryParameter = exports.translateFromFormDataParameters = exports.translateToBodyParameter = exports.translateToHeaderParams = exports.translateToHeaderParam = void 0;
const json_1 = require("@stoplight/json");
const types_1 = require("@stoplight/types");
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
const FORM_DATA_CONSUMES = ['application/x-www-form-urlencoded', 'multipart/form-data'];
function chooseQueryParameterStyle(parameter) {
    if (parameter.type !== 'array') {
        return { style: types_1.HttpParamStyles.Unspecified };
    }
    switch (parameter.collectionFormat) {
        case 'csv':
            return { style: types_1.HttpParamStyles.CommaDelimited };
        case 'ssv':
            return { style: types_1.HttpParamStyles.SpaceDelimited };
        case 'tsv':
            return { style: types_1.HttpParamStyles.TabDelimited };
        case 'pipes':
            return { style: types_1.HttpParamStyles.PipeDelimited };
        case 'multi':
            return { style: types_1.HttpParamStyles.Form, explode: true };
        default:
            return { style: types_1.HttpParamStyles.CommaDelimited };
    }
}
exports.translateToHeaderParam = (0, context_1.withContext)(function (param) {
    const name = param.name;
    const keyOrName = (0, resolver_1.getSharedKey)(param, name);
    return {
        id: this.generateId.httpHeader({ keyOrName, componentType: 'parameter' }),
        name,
        style: types_1.HttpParamStyles.Simple,
        ...buildSchemaForParameter.call(this, param),
        ...(0, lodash_1.pickBy)({
            required: param.required,
        }, guards_1.isBoolean),
    };
});
const translateToHeaderParamsFromPair = function ([name, value]) {
    if ((0, guards_2.isReferenceObject)(value)) {
        value.name = name;
        return value;
    }
    if (!(0, json_1.isPlainObject)(value))
        return;
    const param = { name, in: 'header', ...value };
    if (!(0, guards_3.isHeaderParam)(param))
        return;
    return exports.translateToHeaderParam.call(this, param);
};
const translateToHeaderParams = function (headers) {
    return (0, utils_1.entries)(headers).map(translateToHeaderParamsFromPair, this).filter(guards_1.isNonNullable);
};
exports.translateToHeaderParams = translateToHeaderParams;
exports.translateToBodyParameter = (0, context_1.withContext)(function (body, consumes) {
    const id = this.generateId.httpRequestBody({});
    const examples = (0, utils_1.entries)(body['x-examples'] || (0, accessors_1.getExamplesFromSchema)(body.schema)).map(([key, value]) => examples_1.translateToDefaultExample.call(this, key, value));
    const nonFormDataConsumes = consumes.filter(c => !FORM_DATA_CONSUMES.includes(c));
    return {
        id,
        contents: nonFormDataConsumes.map((0, context_1.withContext)(mediaType => {
            return {
                id: this.generateId.httpMedia({ mediaType }),
                mediaType,
                examples,
                ...(0, lodash_1.pickBy)({
                    schema: (0, json_1.isPlainObject)(body.schema) ? schema_1.translateSchemaObject.call(this, body.schema) : void 0,
                }, guards_1.isNonNullable),
            };
        }), this),
        ...(0, lodash_1.pickBy)({
            required: body.required,
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            description: body.description,
        }, guards_1.isString),
        ...(0, lodash_1.pickBy)({
            name: body.name,
        }, guards_1.isString),
    };
});
exports.translateFromFormDataParameters = (0, context_1.withContext)(function (parameters, consumes) {
    const formDataConsumes = consumes.filter(c => FORM_DATA_CONSUMES.includes(c));
    const finalBody = {
        id: this.generateId.httpRequestBody({ consumes: formDataConsumes }),
        contents: formDataConsumes.map((0, context_1.withContext)(mediaType => ({
            id: this.generateId.httpMedia({ mediaType }),
            mediaType,
            ...(0, lodash_1.pickBy)({
                schema: parameters.length > 0 ? schema_1.translateSchemaObject.call(this, { type: 'object', properties: {} }) : void 0,
            }, guards_1.isNonNullable),
        })), this),
    };
    return parameters.reduce((body, parameter) => {
        var _a, _b;
        var _c;
        const { schema = {}, description } = buildSchemaForParameter.call(this, parameter);
        delete schema.$schema;
        delete schema['x-stoplight'];
        for (const content of body.contents) {
            if (typeof description === 'string' && description.length > 0) {
                schema.description = description;
            }
            content.schema.properties[parameter.name] = schema;
            if (parameter.required) {
                ((_a = (_c = content.schema).required) !== null && _a !== void 0 ? _a : (_c.required = [])).push(parameter.name);
            }
            const encoding = buildEncoding(parameter);
            if (encoding) {
                ((_b = content.encodings) !== null && _b !== void 0 ? _b : (content.encodings = [])).push(encoding);
            }
        }
        return body;
    }, finalBody);
});
function buildEncoding(parameter) {
    switch (parameter.collectionFormat) {
        case 'csv':
            return {
                property: parameter.name,
                style: types_1.HttpParamStyles.CommaDelimited,
                explode: false,
            };
        case 'pipes':
            return {
                property: parameter.name,
                style: types_1.HttpParamStyles.PipeDelimited,
                explode: false,
            };
        case 'multi':
            return {
                property: parameter.name,
                style: types_1.HttpParamStyles.Form,
                explode: true,
            };
        case 'ssv':
            return {
                property: parameter.name,
                style: types_1.HttpParamStyles.SpaceDelimited,
                explode: false,
            };
    }
    return null;
}
exports.translateToQueryParameter = (0, context_1.withContext)(function (param) {
    const name = param.name;
    const keyOrName = (0, resolver_1.getSharedKey)(param, name);
    return {
        id: this.generateId.httpQuery({ keyOrName }),
        name,
        ...chooseQueryParameterStyle(param),
        ...buildSchemaForParameter.call(this, param),
        ...(0, lodash_1.pickBy)({
            allowEmptyValue: param.allowEmptyValue,
            required: param.required,
        }, guards_1.isBoolean),
    };
});
exports.translateToPathParameter = (0, context_1.withContext)(function (param) {
    const name = param.name;
    const keyOrName = (0, resolver_1.getSharedKey)(param, name);
    return {
        id: this.generateId.httpPathParam({ keyOrName }),
        name,
        style: types_1.HttpParamStyles.Simple,
        ...buildSchemaForParameter.call(this, param),
        ...(0, lodash_1.pickBy)({
            required: param.required,
        }, guards_1.isBoolean),
    };
});
const buildSchemaForParameter = function (param) {
    const schema = (0, lodash_1.pick)(param, 'type', 'format', 'default', 'enum', 'exclusiveMaximum', 'exclusiveMinimum', 'maxItems', 'maxLength', 'maximum', 'minItems', 'minimum', 'minLength', 'title', 'items', 'pattern', 'uniqueItems', 'multipleOf');
    if ('allowEmptyValue' in param && param.allowEmptyValue === false) {
        schema.minLength = 1;
    }
    return {
        ...(0, lodash_1.pickBy)({
            schema: Object.keys(schema).length > 0 ? schema_1.translateSchemaObject.call(this, schema) : void 0,
        }, guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            deprecated: param['x-deprecated'],
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            description: param.description,
        }, guards_1.isString),
    };
};
exports.translateToSharedParameters = (0, context_1.withContext)(function (root) {
    const sharedParameters = {
        header: [],
        query: [],
        cookie: [],
        path: [],
        unknownParameters: [],
    };
    for (const [key, value] of (0, utils_1.entries)(root.parameters)) {
        (0, resolver_1.setSharedKey)(value, key);
        if (!(0, guards_2.isValidOas2ParameterObject)(value) || value.in === 'formData' || value.in === 'body')
            continue;
        this.references[`#/parameters/${key}`] = {
            resolved: true,
            value: `#/components/${value.in}/${sharedParameters[value.in].length}`,
        };
        if ((0, guards_3.isQueryParam)(value)) {
            sharedParameters.query.push({
                key,
                ...exports.translateToQueryParameter.call(this, value),
            });
        }
        else if ((0, guards_3.isPathParam)(value)) {
            sharedParameters.path.push({
                key,
                ...exports.translateToPathParameter.call(this, value),
            });
        }
        else if ((0, guards_3.isHeaderParam)(value)) {
            sharedParameters.header.push({
                key,
                ...exports.translateToHeaderParam.call(this, value),
            });
        }
    }
    return sharedParameters;
});
//# sourceMappingURL=params.js.map