"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSingleSecurity = exports.translateToSecurities = void 0;
const json_1 = require("@stoplight/json");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const accessors_1 = require("../../oas/accessors");
const accessors_2 = require("../accessors");
const guards_2 = require("../guards");
const translateToSecurities = function (operationSecurities, kind) {
    this.context = 'service';
    const securities = (0, accessors_2.getSecurities)(this.document, operationSecurities);
    return securities.map(security => security.map(exports.translateToSingleSecurity.bind(this, kind)).filter(guards_1.isNonNullable));
};
exports.translateToSecurities = translateToSecurities;
exports.translateToSingleSecurity = (0, context_1.withContext)(function (kind, [key, securityScheme], index) {
    var _a, _b;
    const baseObject = {
        id: this.generateId.httpSecurity({
            keyOrName: key,
            kind,
            ...(kind === 'requirement'
                ? {
                    index,
                    scopeKeys: (0, accessors_2.getScopeKeys)(securityScheme),
                }
                : {}),
        }),
        key,
        extensions: (0, accessors_1.getExtensions)(securityScheme),
    };
    if (securityScheme.description) {
        baseObject.description = securityScheme.description;
    }
    if (securityScheme.type === 'apiKey') {
        return {
            ...baseObject,
            type: 'apiKey',
            name: securityScheme.name,
            in: securityScheme.in,
        };
    }
    if (securityScheme.type === 'http') {
        if (((_a = securityScheme.scheme) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'bearer') {
            return {
                ...baseObject,
                type: 'http',
                scheme: 'bearer',
                bearerFormat: securityScheme.bearerFormat,
            };
        }
        return {
            ...baseObject,
            type: 'http',
            scheme: (_b = securityScheme.scheme) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
        };
    }
    if (securityScheme.type === 'oauth2') {
        return {
            ...baseObject,
            type: 'oauth2',
            flows: transformFlows(securityScheme.flows),
        };
    }
    if (securityScheme.type === 'openIdConnect') {
        return {
            ...baseObject,
            type: 'openIdConnect',
            openIdConnectUrl: securityScheme.openIdConnectUrl,
        };
    }
    if (securityScheme.type === 'mutualTLS') {
        return {
            ...baseObject,
            type: 'mutualTLS',
        };
    }
    return undefined;
});
function transformFlows(flows) {
    const transformedFlows = {};
    if (!(0, json_1.isPlainObject)(flows)) {
        return transformedFlows;
    }
    if ((0, guards_2.isOAuthFlowObject)(flows.password) && typeof flows.password.tokenUrl === 'string') {
        transformedFlows.password = {
            ...(typeof flows.password.refreshUrl === 'string' && { refreshUrl: flows.password.refreshUrl }),
            tokenUrl: flows.password.tokenUrl,
            scopes: flows.password.scopes,
        };
    }
    if ((0, guards_2.isOAuthFlowObject)(flows.implicit) && typeof flows.implicit.authorizationUrl === 'string') {
        transformedFlows.implicit = {
            ...(typeof flows.implicit.refreshUrl === 'string' && { refreshUrl: flows.implicit.refreshUrl }),
            authorizationUrl: flows.implicit.authorizationUrl,
            scopes: flows.implicit.scopes,
        };
    }
    if ((0, guards_2.isOAuthFlowObject)(flows.authorizationCode) &&
        typeof flows.authorizationCode.authorizationUrl === 'string' &&
        typeof flows.authorizationCode.tokenUrl === 'string') {
        transformedFlows.authorizationCode = {
            ...(typeof flows.authorizationCode.refreshUrl === 'string' && { refreshUrl: flows.authorizationCode.refreshUrl }),
            authorizationUrl: flows.authorizationCode.authorizationUrl,
            scopes: flows.authorizationCode.scopes,
            tokenUrl: flows.authorizationCode.tokenUrl,
        };
    }
    if ((0, guards_2.isOAuthFlowObject)(flows.clientCredentials) && typeof flows.clientCredentials.tokenUrl === 'string') {
        transformedFlows.clientCredentials = {
            ...(typeof flows.clientCredentials.refreshUrl === 'string' && { refreshUrl: flows.clientCredentials.refreshUrl }),
            scopes: flows.clientCredentials.scopes,
            tokenUrl: flows.clientCredentials.tokenUrl,
        };
    }
    return transformedFlows;
}
//# sourceMappingURL=securities.js.map