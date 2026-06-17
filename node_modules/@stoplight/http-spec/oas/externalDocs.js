"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toExternalDocs = void 0;
function toExternalDocs(externalDocs) {
    if (!externalDocs || typeof externalDocs !== 'object') {
        return {};
    }
    const url = getUrl(externalDocs);
    if (url === undefined) {
        return {};
    }
    const description = getDescription(externalDocs);
    const descriptionProp = description ? { description } : {};
    return {
        externalDocs: {
            url,
            ...descriptionProp,
        },
    };
}
exports.toExternalDocs = toExternalDocs;
const ALL_WHITESPACE = /^\s*$/;
function getUrl(externalDocs) {
    const url = externalDocs === null || externalDocs === void 0 ? void 0 : externalDocs.url;
    if (!url || typeof url !== 'string' || ALL_WHITESPACE.test(url)) {
        return undefined;
    }
    return url;
}
function getDescription(externalDocs) {
    const description = externalDocs.description;
    if (!description || typeof description !== 'string' || ALL_WHITESPACE.test(description)) {
        return undefined;
    }
    return description;
}
//# sourceMappingURL=externalDocs.js.map