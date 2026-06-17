"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOas2Service = exports.bundleOas2Service = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../context");
const guards_1 = require("../guards");
const context_2 = require("../oas/context");
const guards_2 = require("../oas/guards");
const resolver_1 = require("../oas/resolver");
const service_1 = require("../oas/service");
const components_1 = require("../oas/transformers/components");
const schema_1 = require("../oas/transformers/schema");
const types_1 = require("../oas/types");
const utils_1 = require("../utils");
const operation_1 = require("./operation");
const params_1 = require("./transformers/params");
const responses_1 = require("./transformers/responses");
const securities_1 = require("./transformers/securities");
const servers_1 = require("./transformers/servers");
const oas2BundleResolveRef = function (target) {
    const output = resolver_1.resolveRef.call(this, target);
    if (target.$ref.startsWith('#/responses/')) {
        return output;
    }
    if ((0, guards_2.isValidOas2ParameterObject)(output) && (output.in === 'formData' || output.in === 'body')) {
        return output;
    }
    return (0, resolver_1.syncReferenceObject)(target, this.references);
};
const bundleOas2Service = ({ document: _document }) => {
    const ctx = (0, context_2.createContext)(_document, oas2BundleResolveRef);
    const { document } = ctx;
    const { securitySchemes, ...service } = (0, exports.transformOas2Service)({ document, ctx });
    const components = {
        ...components_1.translateToComponents.call(ctx, types_1.OasVersion.OAS2, {
            definitions: schema_1.translateSchemaObjectFromPair,
            securityDefinitions: translateSecurityScheme,
        }),
        ...responses_1.translateToSharedResponses.call(ctx, document),
        ...params_1.translateToSharedParameters.call(ctx, document),
        callbacks: [],
    };
    const operations = (0, operation_1.transformOas2Operations)(document, ctx);
    return {
        ...service,
        operations,
        webhooks: [],
        components,
    };
};
exports.bundleOas2Service = bundleOas2Service;
const transformOas2Service = ({ document, ctx = (0, context_2.createContext)(document) }) => {
    var _a;
    const httpService = service_1.transformOasService.call(ctx);
    if ((_a = document.info) === null || _a === void 0 ? void 0 : _a.license) {
        httpService.license = {
            ...document.info.license,
            name: document.info.license.name || '',
        };
    }
    const schemes = Array.isArray(document.schemes) ? document.schemes.filter(guards_1.isString) : [];
    const servers = schemes.map(servers_1.translateToServer, ctx).filter(guards_1.isNonNullable);
    if (servers.length) {
        httpService.servers = servers;
    }
    const securitySchemes = (0, utils_1.entries)(document.securityDefinitions).map(translateSecurityScheme, ctx).filter(guards_1.isNonNullable);
    if (securitySchemes.length) {
        httpService.securitySchemes = securitySchemes;
    }
    const security = Array.isArray(document.security)
        ? document.security
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
                                return undefined;
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
            .filter(guards_1.isNonNullable)
        : [];
    if (security.length) {
        httpService.security = security;
    }
    return httpService;
};
exports.transformOas2Service = transformOas2Service;
const translateSecurityScheme = (0, context_1.withContext)(function ([key, definition], index) {
    if (!(0, json_1.isPlainObject)(definition))
        return;
    return securities_1.translateToSingleSecurity.call(this, 'scheme', { ...definition, key }, index, []);
});
//# sourceMappingURL=service.js.map