"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScopeKeys = exports.getSecurities = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const guards_1 = require("../guards");
const accessors_1 = require("../oas/accessors");
const utils_1 = require("../utils");
const guards_2 = require("./guards");
function getSecurities(document, operationSecurities) {
    var _a;
    const definitions = (_a = document.components) === null || _a === void 0 ? void 0 : _a.securitySchemes;
    if (!(0, json_1.isPlainObject)(definitions))
        return [];
    return (Array.isArray(operationSecurities) ? operationSecurities : document.security || []).map(operationSecurity => {
        return (0, utils_1.entries)(operationSecurity)
            .map(([opScheme, scopes]) => {
            const definition = definitions[opScheme];
            if (!(0, guards_2.isSecurityScheme)(definition))
                return;
            if (definition.type === 'oauth2') {
                return [
                    opScheme,
                    {
                        ...definition,
                        flows: Object.fromEntries((0, utils_1.entries)(definition.flows).map(([name, flow]) => [
                            name,
                            {
                                ...flow,
                                scopes: (0, lodash_1.pickBy)(flow === null || flow === void 0 ? void 0 : flow.scopes, (_val, key) => scopes === null || scopes === void 0 ? void 0 : scopes.includes(key)),
                            },
                        ])),
                        extensions: (0, accessors_1.getExtensions)(definition),
                    },
                ];
            }
            const extensions = (scopes === null || scopes === void 0 ? void 0 : scopes.length) ? { ['x-scopes']: scopes } : {};
            return [
                opScheme,
                {
                    ...definition,
                    ...extensions,
                    extensions: (0, accessors_1.getExtensions)({ ...definition, ...extensions }),
                },
            ];
        })
            .filter(guards_1.isNonNullable);
    });
}
exports.getSecurities = getSecurities;
function getScopeKeys(scheme) {
    if (!scheme.flows) {
        return undefined;
    }
    const scopes = [];
    function collectScopes(flowType, flow) {
        var _a;
        for (const scope of Object.keys((_a = flow === null || flow === void 0 ? void 0 : flow.scopes) !== null && _a !== void 0 ? _a : {})) {
            scopes.push(`${flowType}::${scope}`);
        }
    }
    collectScopes('implicit', scheme.flows.implicit);
    collectScopes('password', scheme.flows.password);
    collectScopes('clientCredentials', scheme.flows.clientCredentials);
    collectScopes('authorizationCode', scheme.flows.authorizationCode);
    return scopes;
}
exports.getScopeKeys = getScopeKeys;
//# sourceMappingURL=accessors.js.map