"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
function generateId() {
    return ('_gen_' +
        Math.round(Math.pow(8, 6) * Math.random())
            .toString(16)
            .padStart(6, '0'));
}
exports.generateId = generateId;
//# sourceMappingURL=id.js.map