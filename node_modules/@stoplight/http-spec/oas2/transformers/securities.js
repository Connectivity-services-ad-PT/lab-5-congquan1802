"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSecurities = exports.translateToSingleSecurity = exports.translateToOauth2SecurityScheme = exports.translateToApiKeySecurityScheme = exports.translateToBasicSecurityScheme = exports.translateToFlows = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const accessors_1 = require("../../oas/accessors");
const accessors_2 = require("../accessors");
const guards_2 = require("../guards");
const translateToFlows = function (security) {
    const flows = {};
    const scopes = (0, json_1.isPlainObject)(security.scopes) ? (0, lodash_1.pickBy)(security.scopes, guards_1.isString) : {};
    const authorizationUrl = 'authorizationUrl' in security && typeof security.authorizationUrl === 'string' ? security.authorizationUrl : '';
    const tokenUrl = 'tokenUrl' in security && typeof security.tokenUrl === 'string' ? security.tokenUrl : '';
    if (security.flow === 'implicit') {
        flows.implicit = {
            authorizationUrl,
            scopes,
        };
    }
    else if (security.flow === 'password') {
        flows.password = {
            tokenUrl,
            scopes,
        };
    }
    else if (security.flow === 'application') {
        flows.clientCredentials = {
            tokenUrl,
            scopes,
        };
    }
    else if (security.flow === 'accessCode') {
        flows.authorizationCode = {
            authorizationUrl,
            tokenUrl,
            scopes,
        };
    }
    return flows;
};
exports.translateToFlows = translateToFlows;
exports.translateToBasicSecurityScheme = (0, context_1.withContext)(function (security, kind, index) {
    const key = security.key;
    return {
        id: this.generateId.httpSecurity({
            keyOrName: key,
            kind,
            ...(kind === 'requirement'
                ? {
                    index,
                }
                : {}),
        }),
        type: 'http',
        scheme: 'basic',
        key,
        ...(0, lodash_1.pickBy)({
            description: security.description,
        }, guards_1.isString),
        extensions: (0, accessors_1.getExtensions)(security),
    };
});
const ACCEPTABLE_SECURITY_ORIGINS = ['query', 'header'];
exports.translateToApiKeySecurityScheme = (0, context_1.withContext)(function (security, kind, index) {
    if ('in' in security && security.in && ACCEPTABLE_SECURITY_ORIGINS.includes(security.in)) {
        const key = security.key;
        return {
            id: this.generateId.httpSecurity({
                keyOrName: key,
                kind,
                ...(kind === 'requirement'
                    ? {
                        index,
                    }
                    : {}),
            }),
            type: 'apiKey',
            in: security.in,
            name: (0, guards_1.isString)(security.name) ? security.name : '',
            key,
            ...(0, lodash_1.pickBy)({
                description: security.description,
            }, guards_1.isString),
            extensions: (0, accessors_1.getExtensions)(security),
        };
    }
    return;
});
const VALID_OAUTH2_FLOWS = ['implicit', 'password', 'application', 'accessCode'];
exports.translateToOauth2SecurityScheme = (0, context_1.withContext)(function (security, kind, index) {
    if (!security.flow || !VALID_OAUTH2_FLOWS.includes(security.flow))
        return undefined;
    const key = security.key;
    return {
        id: this.generateId.httpSecurity({
            keyOrName: key,
            kind,
            ...(kind === 'requirement'
                ? {
                    index,
                }
                : {}),
        }),
        type: 'oauth2',
        flows: exports.translateToFlows.call(this, security),
        key,
        ...(0, lodash_1.pickBy)({
            description: security.description,
        }, guards_1.isString),
        extensions: (0, accessors_1.getExtensions)(security),
    };
});
const translateToSingleSecurity = function (kind, security, index) {
    if ((0, guards_2.isSecurityScheme)(security)) {
        switch (security.type) {
            case 'basic':
                return exports.translateToBasicSecurityScheme.call(this, security, kind, index);
            case 'apiKey':
                return exports.translateToApiKeySecurityScheme.call(this, security, kind, index);
            case 'oauth2':
                return exports.translateToOauth2SecurityScheme.call(this, security, kind, index);
        }
    }
    return undefined;
};
exports.translateToSingleSecurity = translateToSingleSecurity;
exports.translateToSecurities = (0, context_1.withContext)(function (operationSecurities, kind) {
    this.context = 'service';
    const securities = (0, accessors_2.getSecurities)(this.document, operationSecurities);
    return securities.map(security => security.map(exports.translateToSingleSecurity.bind(this, kind)).filter(guards_1.isNonNullable));
});
//# sourceMappingURL=securities.js.map