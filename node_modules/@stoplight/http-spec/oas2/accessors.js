"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExamplesFromSchema = exports.normalizeProducesOrConsumes = exports.getConsumes = exports.getProduces = exports.getSecurities = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const guards_1 = require("../guards");
const guards_2 = require("./guards");
function getSecurities(spec, operationSecurity) {
    if (!(0, guards_1.isNonNullable)(spec.securityDefinitions) || (0, lodash_1.isEmpty)(spec.securityDefinitions))
        return [];
    const security = !!operationSecurity ? operationSecurity : spec.security;
    const securities = getSecurity(security, spec.securityDefinitions);
    if (isOptionalSecurity(security)) {
        securities.push([]);
    }
    return securities;
}
exports.getSecurities = getSecurities;
function getProduces(spec, operation) {
    return getProducesOrConsumes('produces', spec, operation);
}
exports.getProduces = getProduces;
function getConsumes(spec, operation) {
    return getProducesOrConsumes('consumes', spec, operation);
}
exports.getConsumes = getConsumes;
function getSecurity(security, definitions) {
    if (!Array.isArray(security) || !definitions) {
        return [];
    }
    return security
        .map(sec => {
        if (!(0, json_1.isPlainObject)(sec))
            return [];
        return Object.keys(sec)
            .map(key => {
            const def = definitions[key];
            if ((0, guards_2.isSecurityScheme)(def)) {
                const defCopy = { ...def, key };
                const secKey = sec[key];
                const scopes = Array.isArray(secKey) ? secKey : [];
                if (defCopy.type === 'oauth2' && scopes.length) {
                    defCopy.scopes = (0, lodash_1.pickBy)(defCopy.scopes, (_val, s) => scopes.includes(s));
                }
                return defCopy;
            }
            return null;
        })
            .filter(guards_1.isNonNullable);
    })
        .filter(scheme => !(0, lodash_1.isEmpty)(scheme));
}
function normalizeProducesOrConsumes(input) {
    if (!Array.isArray(input)) {
        return [];
    }
    return input.flat().filter(guards_1.isString);
}
exports.normalizeProducesOrConsumes = normalizeProducesOrConsumes;
function getProducesOrConsumes(which, spec, operation) {
    return normalizeProducesOrConsumes((operation === null || operation === void 0 ? void 0 : operation[which]) || (spec === null || spec === void 0 ? void 0 : spec[which]));
}
function getExamplesFromSchema(data) {
    if (!(0, json_1.isPlainObject)(data))
        return {};
    return {
        ...((0, json_1.isPlainObject)(data['x-examples']) && { ...data['x-examples'] }),
        ...('example' in data && { default: data.example }),
    };
}
exports.getExamplesFromSchema = getExamplesFromSchema;
function isOptionalSecurity(security) {
    return Array.isArray(security) && security.length > 1 && security.some(scheme => (0, lodash_1.isEmpty)(scheme));
}
//# sourceMappingURL=accessors.js.map