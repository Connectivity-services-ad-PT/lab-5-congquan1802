"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractId = exports.collectExplicitProperties = exports.isEqual = exports.entries = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
function entries(o) {
    return (0, json_1.isPlainObject)(o) ? Object.entries(o) : [];
}
exports.entries = entries;
function isEqual(left, right) {
    return (0, lodash_1.isEqualWith)(left, right, (value, other, indexOrKey) => {
        if (indexOrKey === 'id')
            return true;
        return;
    });
}
exports.isEqual = isEqual;
function collectExplicitProperties(o) {
    return (0, json_1.isPlainObject)(o) ? Object.keys(o).filter(word => word !== 'x-stoplight') : [];
}
exports.collectExplicitProperties = collectExplicitProperties;
function extractId(schema) {
    if ((0, json_1.isPlainObject)(schema) &&
        (0, json_1.isPlainObject)(schema['x-stoplight']) &&
        typeof schema['x-stoplight']['id'] === 'string') {
        return schema['x-stoplight']['id'];
    }
    return;
}
exports.extractId = extractId;
//# sourceMappingURL=utils.js.map