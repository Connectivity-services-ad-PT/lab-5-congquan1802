"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.setSkipHashing = void 0;
const fnv = require("fnv-plus");
let SKIP_HASHING = false;
const setSkipHashing = (skip) => {
    SKIP_HASHING = skip;
};
exports.setSkipHashing = setSkipHashing;
const hash = (value, skipHashing = SKIP_HASHING) => {
    return skipHashing ? value : fnv.fast1a52hex(value);
};
exports.hash = hash;
//# sourceMappingURL=hash.js.map