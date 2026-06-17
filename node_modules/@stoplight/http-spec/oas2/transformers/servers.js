"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToServer = exports.translateToServers = void 0;
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../guards");
exports.translateToServers = (0, context_1.withContext)(function (operation) {
    let schemes;
    if (Array.isArray(operation.schemes)) {
        schemes = operation.schemes;
        this.context = 'operation';
    }
    else if (Array.isArray(this.document.schemes)) {
        schemes = this.document.schemes;
        this.context = 'service';
    }
    else {
        return [];
    }
    return schemes.map(exports.translateToServer, this).filter(guards_1.isNonNullable);
});
exports.translateToServer = (0, context_1.withContext)(function (scheme) {
    var _a;
    const { host } = this.document;
    if (typeof host !== 'string' || host.length === 0) {
        return;
    }
    if (!(0, guards_1.isString)(scheme) || !(0, guards_2.isValidScheme)(scheme))
        return;
    const basePath = typeof this.document.basePath === 'string' && this.document.basePath.length > 0 ? this.document.basePath : null;
    const uri = new URL('https://localhost');
    uri.protocol = `${scheme}:`;
    uri.host = host;
    if (basePath !== null) {
        uri.pathname = basePath;
    }
    const url = uri.toString().replace(/\/$/, '');
    return {
        id: this.generateId.httpServer({ url }),
        url,
        ...(0, lodash_1.pickBy)({
            name: (_a = this.document.info) === null || _a === void 0 ? void 0 : _a.title,
        }, guards_1.isString),
    };
});
//# sourceMappingURL=servers.js.map