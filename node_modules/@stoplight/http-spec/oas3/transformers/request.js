"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToRequest = exports.translateParameterObject = exports.translateRequestBody = exports.translateToSharedRequestBody = void 0;
const json_1 = require("@stoplight/json");
const types_1 = require("@stoplight/types");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const oas_1 = require("../../oas");
const accessors_1 = require("../../oas/accessors");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
const examples_1 = require("../../oas/transformers/examples");
const schema_1 = require("../../oas/transformers/schema");
const utils_1 = require("../../utils");
const guards_3 = require("../guards");
const content_1 = require("./content");
const examples_2 = require("./examples");
exports.translateToSharedRequestBody = (0, context_1.withContext)(function ([key, requestBodyObject]) {
    const maybeRequestBodyObject = this.maybeResolveLocalRef(requestBodyObject);
    if ((0, guards_2.isReferenceObject)(maybeRequestBodyObject)) {
        maybeRequestBodyObject.key = key;
        return maybeRequestBodyObject;
    }
    return exports.translateRequestBody.call(this, key, maybeRequestBodyObject);
});
exports.translateRequestBody = (0, context_1.withContext)(function (key, requestBodyObject) {
    var _a;
    const maybeRequestBodyObject = (_a = this.maybeResolveLocalRef(requestBodyObject)) !== null && _a !== void 0 ? _a : requestBodyObject;
    if ((0, guards_2.isReferenceObject)(maybeRequestBodyObject)) {
        return maybeRequestBodyObject;
    }
    if (!(0, guards_3.isRequestBodyObject)(maybeRequestBodyObject))
        return;
    const id = this.generateId.httpRequestBody({
        key: this.context === 'service' ? (0, resolver_1.getSharedKey)(maybeRequestBodyObject, key) : key,
    });
    return {
        id,
        contents: (0, utils_1.entries)(maybeRequestBodyObject.content).map(content_1.translateMediaTypeObject, this).filter(guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            required: maybeRequestBodyObject.required,
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            description: maybeRequestBodyObject.description,
        }, guards_1.isString),
    };
});
const translateParameterObjectSchema = (0, context_1.withContext)(function (parameterObject) {
    if (!(0, json_1.isPlainObject)(parameterObject.schema))
        return;
    return schema_1.translateSchemaObject.call(this, {
        ...parameterObject.schema,
        ...('example' in parameterObject ? { example: parameterObject.example } : null),
    });
});
exports.translateParameterObject = (0, context_1.withContext)(function (parameterObject) {
    if (this.context === 'path') {
        this.context = 'operation';
        this.parentId = this.ids['operation'];
    }
    const kind = parameterObject.in === 'path' ? 'pathParam' : parameterObject.in;
    const name = parameterObject.name;
    const keyOrName = (0, resolver_1.getSharedKey)(parameterObject, name);
    const id = this.generateId[`http${kind[0].toUpperCase()}${kind.slice(1)}`]({ keyOrName, componentType: 'parameter' });
    const schema = translateParameterObjectSchema.call(this, parameterObject);
    const examples = (0, utils_1.entries)(parameterObject.examples).map(examples_2.translateToExample, this).filter(guards_1.isNonNullable);
    const hasDefaultExample = examples.some(example => !(0, guards_2.isReferenceObject)(example) && example.key.includes('default'));
    return {
        id,
        name,
        style: (0, guards_2.isValidOas3ParamStyle)(parameterObject.style)
            ? parameterObject.style
            :
                parameterObject.in === 'query' || parameterObject.in === 'cookie'
                    ? types_1.HttpParamStyles.Form
                    : types_1.HttpParamStyles.Simple,
        examples: [
            !hasDefaultExample && parameterObject.example !== undefined
                ? examples_1.translateToDefaultExample.call(this, 'default', parameterObject.example)
                : undefined,
            ...examples,
        ].filter(guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            description: parameterObject.description,
        }, guards_1.isString),
        ...(0, lodash_1.pickBy)({
            deprecated: parameterObject.deprecated,
            required: parameterObject.required,
            explode: parameterObject.explode,
            allowEmptyValue: parameterObject.allowEmptyValue,
            allowReserved: parameterObject.allowReserved,
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            schema,
            content: parameterObject.content,
        }, json_1.isPlainObject),
        explicitProperties: (0, utils_1.collectExplicitProperties)(parameterObject),
    };
});
const iterateOasParams = (0, accessors_1.createOasParamsIterator)(oas_1.OasVersion.OAS3);
exports.translateToRequest = (0, context_1.withContext)(function (path, operation) {
    var _a;
    const params = {
        header: [],
        query: [],
        cookie: [],
        path: [],
        unknown: [],
    };
    for (const param of iterateOasParams.call(this, path, operation)) {
        let kind;
        if ((0, guards_2.isReferenceObject)(param)) {
            kind = (_a = (0, resolver_1.getComponentName)(this.references, param.$ref)) !== null && _a !== void 0 ? _a : '';
        }
        else {
            kind = param.in;
        }
        if (['parameters', 'unknownParameters'].includes(kind))
            kind = 'unknown';
        const target = params[kind || 'unknown'];
        if (!Array.isArray(target))
            continue;
        if ((0, guards_2.isReferenceObject)(param)) {
            target.push((0, resolver_1.syncReferenceObject)(param, this.references));
        }
        else {
            target.push(exports.translateParameterObject.call(this, param));
        }
    }
    const res = {
        ...(0, lodash_1.pickBy)({
            body: exports.translateRequestBody.call(this, void 0, operation === null || operation === void 0 ? void 0 : operation.requestBody),
        }, guards_1.isNonNullable),
        headers: params.header,
        query: params.query,
        cookie: params.cookie,
        path: params.path,
        unknown: params.unknown,
    };
    if (res.unknown && !res.unknown.length) {
        delete res.unknown;
    }
    return res;
});
//# sourceMappingURL=request.js.map