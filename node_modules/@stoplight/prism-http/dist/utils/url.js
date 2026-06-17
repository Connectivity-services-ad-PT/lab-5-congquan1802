"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toURLSearchParams = void 0;
function toURLSearchParams(query) {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query !== null && query !== void 0 ? query : {})) {
        if (typeof value === 'string') {
            urlSearchParams.append(key, value);
        }
        else if (value instanceof Array) {
            for (const innerValue of value) {
                urlSearchParams.append(key, innerValue);
            }
        }
    }
    return urlSearchParams;
}
exports.toURLSearchParams = toURLSearchParams;
