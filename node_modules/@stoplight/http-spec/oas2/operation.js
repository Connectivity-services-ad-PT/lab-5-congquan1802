"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOas2Operation = exports.transformOas2Operations = void 0;
const context_1 = require("../oas/context");
const operation_1 = require("../oas/operation");
const request_1 = require("./transformers/request");
const responses_1 = require("./transformers/responses");
const securities_1 = require("./transformers/securities");
const servers_1 = require("./transformers/servers");
function transformOas2Operations(document, ctx) {
    return (0, operation_1.transformOasEndpointOperations)(document, exports.transformOas2Operation, operation_1.OPERATION_CONFIG, void 0, ctx);
}
exports.transformOas2Operations = transformOas2Operations;
const transformOas2Operation = ({ document: _document, name, method, config, ctx = (0, context_1.createContext)(_document), }) => {
    const httpEndpointOperation = operation_1.transformOasEndpointOperation.call(ctx, config, name, method);
    const parentObj = ctx.maybeResolveLocalRef(ctx.document[config.documentProp][name]);
    const obj = ctx.maybeResolveLocalRef(parentObj[method]);
    return {
        ...httpEndpointOperation,
        responses: responses_1.translateToResponses.call(ctx, obj),
        servers: servers_1.translateToServers.call(ctx, obj),
        request: request_1.translateToRequest.call(ctx, parentObj, obj),
        security: securities_1.translateToSecurities.call(ctx, obj.security, 'requirement'),
    };
};
exports.transformOas2Operation = transformOas2Operation;
//# sourceMappingURL=operation.js.map