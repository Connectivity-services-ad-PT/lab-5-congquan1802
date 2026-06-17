"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateHeaderObject = void 0;
const json_1 = require("@stoplight/json");
const types_1 = require("@stoplight/types");
const lodash_1 = require("lodash");
const context_1 = require("../../context");
const guards_1 = require("../../guards");
const guards_2 = require("../../oas/guards");
const transformers_1 = require("../../oas/transformers");
const examples_1 = require("../../oas/transformers/examples");
const utils_1 = require("../../utils");
const guards_3 = require("../guards");
const examples_2 = require("./examples");
exports.translateHeaderObject = (0, context_1.withContext)(function ([name, unresolvedHeaderObject]) {
    var _a;
    const maybeHeaderObject = (_a = this.maybeResolveLocalRef(unresolvedHeaderObject)) !== null && _a !== void 0 ? _a : unresolvedHeaderObject;
    if ((0, guards_2.isReferenceObject)(maybeHeaderObject)) {
        maybeHeaderObject.name = name;
        return maybeHeaderObject;
    }
    if (!(0, json_1.isPlainObject)(maybeHeaderObject))
        return;
    const id = this.generateId.httpHeader({ keyOrName: name, componentType: 'header' });
    if (!(0, guards_3.isHeaderObject)(maybeHeaderObject)) {
        return {
            id,
            encodings: [],
            examples: [],
            name,
            style: types_1.HttpParamStyles.Simple,
        };
    }
    const { content: contentObject } = maybeHeaderObject;
    const contentValue = (0, json_1.isPlainObject)(contentObject) ? Object.values(contentObject)[0] : null;
    const baseContent = {
        id,
        name,
        style: types_1.HttpParamStyles.Simple,
        ...(0, lodash_1.pickBy)({
            schema: (0, json_1.isPlainObject)(maybeHeaderObject.schema)
                ? transformers_1.translateSchemaObject.call(this, maybeHeaderObject.schema)
                : null,
            content: maybeHeaderObject.content,
        }, guards_1.isNonNullable),
        ...(0, lodash_1.pickBy)({
            description: maybeHeaderObject.description,
        }, guards_1.isString),
        ...(0, lodash_1.pickBy)({
            allowEmptyValue: maybeHeaderObject.allowEmptyValue,
            allowReserved: maybeHeaderObject.allowReserved,
            explode: maybeHeaderObject.explode,
            required: maybeHeaderObject.required,
            deprecated: maybeHeaderObject.deprecated,
        }, guards_1.isBoolean),
    };
    const examples = [];
    const encodings = [];
    if ((0, json_1.isPlainObject)(contentValue)) {
        examples.push(...(0, utils_1.entries)(contentValue.examples).map(examples_2.translateToExample, this).filter(guards_1.isNonNullable));
        if ((0, json_1.isPlainObject)(contentValue.encoding)) {
            encodings.push(...Object.values(contentValue.encoding));
        }
        if ('example' in contentValue) {
            examples.push(examples_1.translateToDefaultExample.call(this, '__default_content', contentValue.example));
        }
    }
    examples.push(...(0, utils_1.entries)(maybeHeaderObject.examples).map(examples_2.translateToExample, this).filter(guards_1.isNonNullable));
    if ('example' in maybeHeaderObject) {
        examples.push(examples_1.translateToDefaultExample.call(this, '__default', maybeHeaderObject.example));
    }
    return {
        ...baseContent,
        encodings,
        examples,
    };
});
//# sourceMappingURL=headers.js.map