"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToComponents = void 0;
const json_1 = require("@stoplight/json");
const guards_1 = require("../../guards");
const utils_1 = require("../../utils");
const guards_2 = require("../guards");
const resolver_1 = require("../resolver");
const types_1 = require("../types");
function createInvokeTranslator(root, translators) {
    const input = root === '#/components' ? this.document.components : this.document;
    return (kind, component) => {
        const translator = translators[kind];
        if (translator === void 0 || !(0, json_1.isPlainObject)(input))
            return [];
        const objects = [];
        const items = (0, utils_1.entries)(input[kind]);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const [key, value] = item;
            (0, resolver_1.setSharedKey)(value, key);
            if ((0, guards_2.isReferenceObject)(value)) {
                this.references[`${root}/${kind}/${key}`] = {
                    resolved: true,
                    value: `#/components/${component}/${objects.length}`,
                };
                const resolvableComponent = {
                    ...value,
                    key,
                };
                objects.push((0, resolver_1.syncReferenceObject)(resolvableComponent, this.references));
                continue;
            }
            const translated = translator.call(this, items[i], i, items);
            if (!(0, guards_1.isNonNullable)(translated))
                continue;
            this.references[`${root}/${kind}/${key}`] = {
                resolved: true,
                value: `#/components/${component}/${objects.length}`,
            };
            translated.key = key;
            objects.push(translated);
        }
        return objects;
    };
}
const translateToComponents = function (spec, translators) {
    const root = spec === types_1.OasVersion.OAS3 ? '#/components' : '#';
    const invokeTranslator = createInvokeTranslator.call(this, root, translators);
    return {
        responses: invokeTranslator('responses', 'responses'),
        schemas: invokeTranslator(spec === types_1.OasVersion.OAS3 ? 'schemas' : 'definitions', 'schemas'),
        requestBodies: invokeTranslator('requestBodies', 'requestBodies'),
        examples: invokeTranslator('examples', 'examples'),
        securitySchemes: invokeTranslator(spec === types_1.OasVersion.OAS3 ? 'securitySchemes' : 'securityDefinitions', 'securitySchemes'),
    };
};
exports.translateToComponents = translateToComponents;
//# sourceMappingURL=components.js.map