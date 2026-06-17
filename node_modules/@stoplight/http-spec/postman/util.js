"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVersion = exports.resolveCollection = exports.transformDescriptionDefinition = exports.transformStringValueToSchema = void 0;
const postman_collection_1 = require("postman-collection");
const id_1 = require("./id");
function transformStringValueToSchema(value) {
    return {
        examples: [
            {
                id: (0, id_1.generateId)(),
                key: 'default',
                value,
            },
        ],
        schema: { type: 'string' },
    };
}
exports.transformStringValueToSchema = transformStringValueToSchema;
function transformDescriptionDefinition(description) {
    return typeof description === 'string' ? description : description.content;
}
exports.transformDescriptionDefinition = transformDescriptionDefinition;
function resolveCollection(collectionDefinition) {
    const collection = new postman_collection_1.Collection(collectionDefinition);
    return new postman_collection_1.Collection(collection.toObjectResolved({ variables: collection.variables }, []));
}
exports.resolveCollection = resolveCollection;
function resolveVersion(version) {
    return version.string ? version.string : `${version.major}.${version.minor}.${version.patch}-${version.prerelease}`;
}
exports.resolveVersion = resolveVersion;
//# sourceMappingURL=util.js.map