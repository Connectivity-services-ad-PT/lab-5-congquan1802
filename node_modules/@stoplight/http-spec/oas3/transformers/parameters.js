"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToSharedParameters = void 0;
const json_1 = require("@stoplight/json");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
const utils_1 = require("../../utils");
const headers_1 = require("./headers");
const request_1 = require("./request");
exports.translateToSharedParameters = (0, context_1.withContext)(function (components) {
    const sharedParameters = {
        header: [],
        query: [],
        cookie: [],
        path: [],
        unknownParameters: [],
    };
    if (!(0, json_1.isPlainObject)(components))
        return sharedParameters;
    for (const [key, value] of (0, utils_1.entries)(components.headers)) {
        (0, resolver_1.setSharedKey)(value, key);
        this.references[`#/components/headers/${key}`] = {
            resolved: true,
            value: `#/components/header/${sharedParameters.header.length}`,
        };
        const header = headers_1.translateHeaderObject.call(this, [key, value]);
        if ((0, guards_1.isNonNullable)(header)) {
            sharedParameters.header.push({
                ...header,
                key,
            });
        }
    }
    const resolvables = [];
    for (const [key, value] of (0, utils_1.entries)(components.parameters)) {
        (0, resolver_1.setSharedKey)(value, key);
        if ((0, guards_2.isReferenceObject)(value)) {
            if ((0, json_1.isLocalRef)(value.$ref)) {
                this.references[`#/components/parameters/${key}`] = {
                    resolved: false,
                    value: value.$ref,
                };
            }
            else {
                this.references[`#/components/parameters/${key}`] = {
                    resolved: true,
                    value: `#/components/unknownParameters/${sharedParameters.unknownParameters.length}`,
                };
                sharedParameters.unknownParameters.push({
                    ...value,
                    key,
                });
            }
            resolvables.push((0, resolver_1.syncReferenceObject)({
                ...value,
                key,
            }, this.references));
            continue;
        }
        if (!(0, guards_2.isValidOas3ParameterObject)(value))
            continue;
        const parameter = request_1.translateParameterObject.call(this, value);
        this.references[`#/components/parameters/${key}`] = {
            resolved: true,
            value: `#/components/${value.in}/${sharedParameters[value.in].length}`,
        };
        sharedParameters[value.in].push({
            ...parameter,
            key,
        });
    }
    for (const resolvable of resolvables) {
        const kind = (0, resolver_1.getComponentName)(this.references, resolvable.$ref);
        if (kind && kind !== 'unknownParameters' && kind in sharedParameters) {
            sharedParameters[kind].push(resolvable);
        }
    }
    return sharedParameters;
});
//# sourceMappingURL=parameters.js.map