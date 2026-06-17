"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeWithDeepObjectStyle = void 0;
function serializeWithDeepObjectStyle(name, value) {
    return serialize(name, [], value);
}
exports.serializeWithDeepObjectStyle = serializeWithDeepObjectStyle;
function serialize(name, path, value) {
    if (value === null) {
        return null;
    }
    else if (typeof value === 'object') {
        const result = Object.keys(value)
            .map(key => serialize(name, [...path, isPositiveInteger(key) ? '' : key], value[key]))
            .filter(key => key !== null)
            .join('&');
        return result.length > 0 ? result : null;
    }
    else {
        return `${name}${path.map(key => `[${key}]`).join('')}=${value}`;
    }
}
function isPositiveInteger(str) {
    return /^\+?\d+$/.test(str) && parseInt(str) >= 0;
}
