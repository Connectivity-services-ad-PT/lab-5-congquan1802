"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPostmanCollectionService = void 0;
const securityScheme_1 = require("./transformers/securityScheme");
const util_1 = require("./util");
const DEFAULT_VERSION = '1.0.0';
const transformPostmanCollectionService = document => {
    const collection = (0, util_1.resolveCollection)(document);
    return {
        id: collection.id,
        name: collection.name,
        version: collection.version ? (0, util_1.resolveVersion)(collection.version) : DEFAULT_VERSION,
        description: collection.description && (0, util_1.transformDescriptionDefinition)(collection.description),
        securitySchemes: (0, securityScheme_1.transformSecuritySchemes)(collection)
            .filter(securityScheme_1.isStandardSecurityScheme)
            .map(pss => pss.securityScheme),
    };
};
exports.transformPostmanCollectionService = transformPostmanCollectionService;
//# sourceMappingURL=service.js.map