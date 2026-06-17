"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToExample = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
exports.translateToExample = (0, context_1.withContext)(function ([key, example]) {
    var _a;
    const maybeExample = (_a = this.maybeResolveLocalRef(example)) !== null && _a !== void 0 ? _a : example;
    if (!(0, json_1.isPlainObject)(maybeExample))
        return;
    if ((0, guards_2.isReferenceObject)(maybeExample)) {
        maybeExample.key = key;
        return maybeExample;
    }
    const keyOrName = this.context === 'service' ? (0, resolver_1.getSharedKey)(maybeExample, key) : key;
    return {
        id: this.generateId.example({ keyOrName }),
        key,
        ...(typeof maybeExample.externalValue === 'string'
            ? { externalValue: maybeExample.externalValue }
            : { value: maybeExample.value }),
        ...(0, lodash_1.pickBy)({
            summary: maybeExample.summary,
            description: maybeExample.description,
        }, guards_1.isString),
    };
});
//# sourceMappingURL=examples.js.map