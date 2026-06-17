"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const context_1 = require("../context");
const hash_1 = require("../hash");
const resolver_1 = require("./resolver");
function createContext(document, resolveRef = resolver_1.resolveRef) {
    return (0, context_1.createContext)(document, resolveRef, hash_1.hash);
}
exports.createContext = createContext;
//# sourceMappingURL=context.js.map