"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateServerVariables = exports.translateToServer = exports.translateToServers = void 0;
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const utils_1 = require("../../utils");
const guards_2 = require("../guards");
exports.translateToServers = (0, context_1.withContext)(function (path, operation) {
    let servers;
    if (Array.isArray(operation.servers)) {
        servers = operation.servers;
    }
    else if (Array.isArray(path.servers)) {
        servers = path.servers;
        this.context = 'path';
    }
    else if (Array.isArray(this.document.servers)) {
        servers = this.document.servers;
        this.context = 'service';
    }
    else {
        return [];
    }
    return servers.map(exports.translateToServer, this).filter(guards_1.isNonNullable);
});
exports.translateToServer = (0, context_1.withContext)(function (server) {
    var _a;
    if (!(0, guards_2.isServerObject)(server))
        return;
    const variables = exports.translateServerVariables.call(this, server.variables);
    return {
        id: this.generateId.httpServer({ url: server.url }),
        url: server.url,
        ...(0, lodash_1.pickBy)({
            name: (_a = this.document.info) === null || _a === void 0 ? void 0 : _a.title,
            description: server.description,
        }, guards_1.isString),
        ...(0, lodash_1.pickBy)({
            variables,
        }, guards_1.isNonNullable),
    };
});
const translateServerVariables = variables => {
    const serverVariables = (0, utils_1.entries)(variables).map(translateServerVariable).filter(guards_1.isNonNullable);
    return serverVariables.length > 0 ? Object.fromEntries(serverVariables) : undefined;
};
exports.translateServerVariables = translateServerVariables;
const translateServerVariable = function ([name, variable]) {
    if (!(0, guards_2.isServerVariableObject)(variable))
        return;
    return [
        name,
        {
            default: String(variable.default),
            ...(0, lodash_1.pickBy)({
                description: variable.description,
            }, guards_1.isString),
            ...(0, lodash_1.pickBy)({
                enum: Array.isArray(variable.enum) ? variable.enum.map(String) : undefined,
            }, guards_1.isNonNullable),
        },
    ];
};
//# sourceMappingURL=servers.js.map