"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToDefaultExample = void 0;
const context_1 = require("../../context");
exports.translateToDefaultExample = (0, context_1.withContext)(function (key, value) {
    const resolvedValue = this.maybeResolveLocalRef(value);
    return {
        id: this.generateId.example({ keyOrName: key }),
        value: resolvedValue,
        key,
    };
});
//# sourceMappingURL=examples.js.map