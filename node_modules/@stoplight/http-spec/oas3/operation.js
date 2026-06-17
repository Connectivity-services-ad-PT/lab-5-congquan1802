"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOas3Operation = exports.transformOas3WebhookOperations = exports.transformOas3Operations = void 0;
const lodash_1 = require("lodash");
const guards_1 = require("../guards");
const oas_1 = require("../oas");
const context_1 = require("../oas/context");
const callbacks_1 = require("./transformers/callbacks");
const request_1 = require("./transformers/request");
const responses_1 = require("./transformers/responses");
const securities_1 = require("./transformers/securities");
const servers_1 = require("./transformers/servers");
function transformOas3Operations(document, ctx) {
    return (0, oas_1.transformOasEndpointOperations)(document, exports.transformOas3Operation, oas_1.OPERATION_CONFIG, void 0, ctx);
}
exports.transformOas3Operations = transformOas3Operations;
function transformOas3WebhookOperations(document, ctx) {
    return (0, oas_1.transformOasEndpointOperations)(document, exports.transformOas3Operation, oas_1.WEBHOOK_CONFIG, void 0, ctx);
}
exports.transformOas3WebhookOperations = transformOas3WebhookOperations;
const transformOas3Operation = ({ document: _document, name, method, config, key, ctx = (0, context_1.createContext)(_document), }) => {
    const httpOperation = oas_1.transformOasEndpointOperation.call(ctx, config, name, method, key);
    const parentObj = ctx.maybeResolveLocalRef(ctx.document[config.documentProp][name]);
    const operation = ctx.maybeResolveLocalRef(parentObj[method]);
    return {
        ...httpOperation,
        responses: responses_1.translateToResponses.call(ctx, operation.responses),
        request: request_1.translateToRequest.call(ctx, parentObj, operation),
        security: securities_1.translateToSecurities.call(ctx, operation.security, 'requirement'),
        servers: servers_1.translateToServers.call(ctx, parentObj, operation),
        ...(0, lodash_1.pickBy)({
            callbacks: callbacks_1.translateToCallbacks.call(ctx, operation.callbacks),
        }, guards_1.isNonNullable),
    };
};
exports.transformOas3Operation = transformOas3Operation;
//# sourceMappingURL=operation.js.map