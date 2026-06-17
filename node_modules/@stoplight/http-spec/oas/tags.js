"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToTags = exports.translateTagDefinition = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const context_1 = require("../context");
const guards_1 = require("../guards");
const accessors_1 = require("./accessors");
const externalDocs_1 = require("./externalDocs");
const translateTag = (0, context_1.withContext)(function (tag) {
    if (tag === null || !(0, guards_1.isSerializablePrimitive)(tag))
        return;
    const name = String(tag);
    return {
        id: this.generateId.tag({ name }),
        name,
    };
});
const translateTagDefinition = function (tag, ...params) {
    if (!(0, json_1.isPlainObject)(tag))
        return;
    const translatedTag = translateTag.call(this, tag.name, ...params);
    if (!translatedTag)
        return;
    const extensions = (0, accessors_1.getExtensions)(tag);
    return {
        ...translatedTag,
        ...(0, lodash_1.pickBy)({
            description: tag.description,
        }, guards_1.isString),
        ...(0, externalDocs_1.toExternalDocs)(tag.externalDocs),
        ...extensions,
    };
};
exports.translateTagDefinition = translateTagDefinition;
const translateToTags = function (tags) {
    return Array.isArray(tags) ? tags.map(translateTag, this).filter(guards_1.isNonNullable) : [];
};
exports.translateToTags = translateToTags;
//# sourceMappingURL=tags.js.map