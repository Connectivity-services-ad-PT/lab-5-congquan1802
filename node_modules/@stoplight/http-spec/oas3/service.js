"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOas3Service = exports.bundleOas3Service = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../context");
const guards_1 = require("../guards");
const context_2 = require("../oas/context");
const resolver_1 = require("../oas/resolver");
const service_1 = require("../oas/service");
const components_1 = require("../oas/transformers/components");
const schema_1 = require("../oas/transformers/schema");
const types_1 = require("../oas/types");
const utils_1 = require("../utils");
const guards_2 = require("./guards");
const operation_1 = require("./operation");
const callbacks_1 = require("./transformers/callbacks");
const examples_1 = require("./transformers/examples");
const parameters_1 = require("./transformers/parameters");
const request_1 = require("./transformers/request");
const responses_1 = require("./transformers/responses");
const securities_1 = require("./transformers/securities");
const servers_1 = require("./transformers/servers");
const bundleOas3Service = ({ document: _document }) => {
    var _a;
    const ctx = (0, context_2.createContext)(_document, resolver_1.bundleResolveRef);
    const { document } = ctx;
    const { securitySchemes, ...service } = (0, exports.transformOas3Service)({ document, ctx });
    const components = {
        ...components_1.translateToComponents.call(ctx, types_1.OasVersion.OAS3, {
            responses: responses_1.translateToResponse,
            requestBodies: request_1.translateToSharedRequestBody,
            examples: examples_1.translateToExample,
            schemas: schema_1.translateSchemaObjectFromPair,
            securitySchemes: translateSecurityScheme,
        }),
        callbacks: (_a = callbacks_1.translateToCallbacks.call(ctx, document.components ? document.components['callbacks'] : [])) !== null && _a !== void 0 ? _a : [],
        ...parameters_1.translateToSharedParameters.call(ctx, document.components),
    };
    const operations = (0, operation_1.transformOas3Operations)(document, ctx);
    const webhooks = (0, operation_1.transformOas3WebhookOperations)(document, ctx);
    return {
        ...service,
        operations,
        webhooks,
        components,
    };
};
exports.bundleOas3Service = bundleOas3Service;
const transformOas3Service = ({ document: _document, ctx = (0, context_2.createContext)(_document), }) => {
    var _a, _b, _c;
    const { document } = ctx;
    const httpService = service_1.transformOasService.call(ctx);
    if (typeof ((_a = document.info) === null || _a === void 0 ? void 0 : _a.summary) === 'string') {
        httpService.summary = document.info.summary;
    }
    if ((_b = document.info) === null || _b === void 0 ? void 0 : _b.license) {
        const { name, identifier, ...license } = document.info.license;
        httpService.license = {
            ...license,
            name: typeof name === 'string' ? name : '',
            ...(typeof identifier === 'string' && { identifier }),
        };
    }
    const servers = Array.isArray(document.servers)
        ? document.servers.map(servers_1.translateToServer, ctx).filter(guards_1.isNonNullable)
        : [];
    if (servers.length) {
        httpService.servers = servers;
    }
    const securitySchemes = (0, utils_1.entries)((_c = document.components) === null || _c === void 0 ? void 0 : _c.securitySchemes)
        .map(translateSecurityScheme, ctx)
        .filter(guards_1.isNonNullable);
    if (securitySchemes.length) {
        httpService.securitySchemes = securitySchemes;
    }
    const security = (Array.isArray(document.security) ? document.security : [])
        .map(sec => {
        if (!(0, json_1.isPlainObject)(sec))
            return null;
        return Object.keys(sec)
            .map(key => {
            const ss = securitySchemes.find(securityScheme => securityScheme.key === key);
            if ((ss === null || ss === void 0 ? void 0 : ss.type) === 'oauth2') {
                const flows = {};
                for (const flowKey in ss.flows) {
                    const flow = ss.flows[flowKey];
                    flows[flowKey] = {
                        ...flow,
                        scopes: (0, lodash_1.pickBy)(flow.scopes, (_val, scopeKey) => {
                            const secKey = sec[key];
                            if (secKey)
                                return secKey.includes(scopeKey);
                            return false;
                        }),
                    };
                }
                return {
                    ...ss,
                    flows,
                };
            }
            return ss;
        })
            .filter(guards_1.isNonNullable);
    })
        .filter(guards_1.isNonNullable);
    if (security.length) {
        httpService.security = security;
    }
    return httpService;
};
exports.transformOas3Service = transformOas3Service;
const translateSecurityScheme = (0, context_1.withContext)(function ([key, definition], index) {
    if (!(0, guards_2.isSecurityScheme)(definition))
        return;
    return securities_1.translateToSingleSecurity.call(this, 'scheme', [key, definition], index, []);
});
//# sourceMappingURL=service.js.map