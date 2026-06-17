"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformServer = void 0;
const id_1 = require("../id");
function transformServer(url) {
    try {
        const origin = new URL(url.toString()).origin;
        return origin ? { id: (0, id_1.generateId)(), url: origin } : undefined;
    }
    catch {
        return undefined;
    }
}
exports.transformServer = transformServer;
//# sourceMappingURL=server.js.map