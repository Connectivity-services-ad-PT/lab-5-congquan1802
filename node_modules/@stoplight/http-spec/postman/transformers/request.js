"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformRequest = void 0;
const params_1 = require("./params");
function transformRequest(request) {
    var _a;
    return {
        query: request.url.query.map(params_1.transformQueryParam),
        headers: request.headers.map(params_1.transformHeader),
        path: (0, params_1.transformPathParams)(request.url.path || []),
        body: request.body ? (0, params_1.transformBody)(request.body, (_a = request.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) : undefined,
    };
}
exports.transformRequest = transformRequest;
//# sourceMappingURL=request.js.map