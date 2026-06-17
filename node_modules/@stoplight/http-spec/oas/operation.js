"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOasEndpointOperation = exports.transformOasEndpointOperations = exports.WEBHOOK_CONFIG = exports.OPERATION_CONFIG = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const guards_1 = require("../guards");
const utils_1 = require("../utils");
const accessors_1 = require("./accessors");
const externalDocs_1 = require("./externalDocs");
const tags_1 = require("./tags");
const transformers_1 = require("./transformers");
const DEFAULT_METHODS = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch', 'trace'];
exports.OPERATION_CONFIG = {
    type: 'operation',
    documentProp: 'paths',
    nameProp: 'path',
};
exports.WEBHOOK_CONFIG = {
    type: 'webhook',
    documentProp: 'webhooks',
    nameProp: 'name',
};
function transformOasEndpointOperations(document, transformer, config, methods = DEFAULT_METHODS, ctx) {
    const entries = (0, json_1.isPlainObject)(document[config.documentProp]) ? Object.entries(document[config.documentProp]) : [];
    return entries.flatMap(([name, value]) => {
        if (!(0, json_1.isPlainObject)(value))
            return [];
        let operations = Object.keys(value);
        if (methods !== null) {
            operations = operations.filter(pathKey => methods.includes(pathKey));
        }
        return operations.map(method => transformer({
            document,
            name,
            method,
            config,
            ctx,
        }));
    });
}
exports.transformOasEndpointOperations = transformOasEndpointOperations;
const transformOasEndpointOperation = function ({ type, documentProp, nameProp }, name, method, key) {
    var _a, _b, _c, _d, _e, _f;
    const pathObj = this.maybeResolveLocalRef((_b = (_a = this.document) === null || _a === void 0 ? void 0 : _a[documentProp]) === null || _b === void 0 ? void 0 : _b[name]);
    if (typeof pathObj !== 'object' || pathObj === null) {
        throw new Error(`Could not find ${[documentProp, name].join('/')} in the provided spec.`);
    }
    const obj = this.maybeResolveLocalRef(pathObj[method]);
    if (!obj) {
        throw new Error(`Could not find ${[documentProp, name, method].join('/')} in the provided spec.`);
    }
    const serviceId = (this.ids.service = String((_c = this.document['x-stoplight']) === null || _c === void 0 ? void 0 : _c.id));
    if (type === 'operation') {
        this.ids.path = this.generateId.httpPath({ parentId: serviceId, path: name });
    }
    else {
        this.ids.webhookName = this.generateId.httpWebhookName({ parentId: serviceId, name });
    }
    let id;
    if (this.context === 'callback') {
        id = this.ids.operation =
            (_d = (0, utils_1.extractId)(obj)) !== null && _d !== void 0 ? _d : this.generateId.httpCallbackOperation({
                parentId: serviceId,
                method,
                path: name,
                key: key !== null && key !== void 0 ? key : '',
            });
    }
    else if (type === 'operation') {
        id = this.ids.operation =
            (_e = (0, utils_1.extractId)(obj)) !== null && _e !== void 0 ? _e : this.generateId.httpOperation({ parentId: serviceId, method, path: name });
    }
    else {
        id = this.ids.webhook =
            (_f = (0, utils_1.extractId)(obj)) !== null && _f !== void 0 ? _f : this.generateId.httpWebhookOperation({ parentId: serviceId, method, name });
    }
    this.parentId = id;
    this.context = type;
    return {
        id,
        method,
        [nameProp]: name,
        tags: tags_1.translateToTags.call(this, obj.tags),
        extensions: (0, accessors_1.getExtensions)(obj),
        ...(0, lodash_1.pickBy)({
            deprecated: obj.deprecated,
            internal: obj['x-internal'],
        }, guards_1.isBoolean),
        ...(0, lodash_1.pickBy)({
            iid: obj.operationId,
            description: obj.description,
            summary: obj.summary,
        }, guards_1.isString),
        securityDeclarationType: (0, transformers_1.translateToSecurityDeclarationType)(obj),
        ...(0, externalDocs_1.toExternalDocs)(obj.externalDocs),
    };
};
exports.transformOasEndpointOperation = transformOasEndpointOperation;
//# sourceMappingURL=operation.js.map