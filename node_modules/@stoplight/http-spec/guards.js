"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSerializablePrimitive = exports.isString = exports.isBoolean = exports.isNonNullable = void 0;
function isNonNullable(value) {
    return value !== undefined && value !== null;
}
exports.isNonNullable = isNonNullable;
function isBoolean(input) {
    return typeof input === 'boolean';
}
exports.isBoolean = isBoolean;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isSerializablePrimitive(value) {
    return isBoolean(value) || isString(value) || typeof value === 'number' || value === null;
}
exports.isSerializablePrimitive = isSerializablePrimitive;
//# sourceMappingURL=guards.js.map