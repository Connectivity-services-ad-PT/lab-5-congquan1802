"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPostmanCollectionOperation = exports.transformPostmanCollectionOperations = void 0;
const merge_1 = require("../merge");
const request_1 = require("./transformers/request");
const response_1 = require("./transformers/response");
const securityScheme_1 = require("./transformers/securityScheme");
const server_1 = require("./transformers/server");
const util_1 = require("./util");
const transformPostmanCollectionOperations = (document) => {
    const collection = (0, util_1.resolveCollection)(document);
    const securitySchemes = (0, securityScheme_1.transformSecuritySchemes)(collection);
    let operations = [];
    collection.forEachItem(item => {
        operations = (0, merge_1.mergeOperations)(operations, [transformItem(item, securitySchemes)]);
    });
    return operations;
};
exports.transformPostmanCollectionOperations = transformPostmanCollectionOperations;
const transformPostmanCollectionOperation = ({ document, path, method, }) => {
    const collection = (0, util_1.resolveCollection)(document);
    const item = findItem(collection, method, path);
    if (!item) {
        throw new Error(`Unable to find "${method} ${path}"`);
    }
    return transformItem(item, (0, securityScheme_1.transformSecuritySchemes)(collection));
};
exports.transformPostmanCollectionOperation = transformPostmanCollectionOperation;
function transformItem(item, securitySchemes) {
    const auth = item.getAuth();
    const postmanSecurity = auth && findPostmanSecurityScheme(auth, securitySchemes);
    const request = (0, request_1.transformRequest)(item.request);
    const security = [];
    if (postmanSecurity) {
        switch (postmanSecurity.type) {
            case 'securityScheme':
                security.push([postmanSecurity.securityScheme]);
                break;
            case 'headerParams':
                request.headers.push(...postmanSecurity.headerParams);
                break;
            case 'queryParams':
                request.query.push(...postmanSecurity.queryParams);
                break;
        }
    }
    const server = (0, server_1.transformServer)(item.request.url);
    return {
        id: '?http-operation-id?',
        iid: item.id,
        description: item.description && (0, util_1.transformDescriptionDefinition)(item.description),
        method: item.request.method.toLowerCase(),
        path: getPath(item.request.url),
        summary: item.name,
        request,
        responses: item.responses.all().reduce((merged, response) => (0, merge_1.mergeResponses)(merged, [(0, response_1.transformResponse)(response)]), []),
        security,
        servers: server ? [server] : undefined,
    };
}
function findItem(collection, method, path) {
    let found;
    collection.forEachItem(item => {
        if (item.request.method.toLowerCase() === method.toLowerCase() &&
            getPath(item.request.url).toLowerCase() === path.toLowerCase()) {
            found = item;
        }
    });
    return found;
}
function findPostmanSecurityScheme(auth, securitySchemes) {
    const securityScheme = (0, securityScheme_1.transformSecurityScheme)(auth, () => '1');
    if (!securityScheme)
        return;
    return securitySchemes.find(ss => (0, securityScheme_1.isPostmanSecuritySchemeEqual)(ss, securityScheme));
}
function getPath(url) {
    return url.path
        ? '/' + url.path.map(segment => (segment.startsWith(':') ? `{${segment.substring(1)}}` : segment)).join('/')
        : '/';
}
//# sourceMappingURL=operation.js.map