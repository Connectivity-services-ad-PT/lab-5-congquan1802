"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpOperationsFromSpec = void 0;
const operation_1 = require("@stoplight/http-spec/oas3/operation");
const operation_2 = require("@stoplight/http-spec/oas2/operation");
const operation_3 = require("@stoplight/http-spec/postman/operation");
const $RefParser = require("@stoplight/json-schema-ref-parser");
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const os = require("os");
async function getHttpOperationsFromSpec(specFilePathOrObject) {
    const prismVersion = require('../../package.json').version;
    const httpResolverOpts = {
        headers: {
            'User-Agent': `PrismMockServer/${prismVersion} (${os.type()} ${os.arch()} ${os.release()})`,
        },
    };
    const result = (0, json_1.decycle)(await new $RefParser().dereference(specFilePathOrObject, { resolve: { http: httpResolverOpts } }));
    let operations = [];
    if (isOpenAPI2(result))
        operations = (0, operation_2.transformOas2Operations)(result);
    else if (isOpenAPI3(result))
        operations = (0, operation_1.transformOas3Operations)(result);
    else if (isPostmanCollection(result))
        operations = (0, operation_3.transformPostmanCollectionOperations)(result);
    else
        throw new Error('Unsupported document format');
    operations.forEach((op, i, ops) => {
        ops[i] = (0, json_1.bundleTarget)({
            document: {
                ...result,
                __target__: op,
            },
            path: '#/__target__',
            cloneDocument: false,
        });
    });
    return operations;
}
exports.getHttpOperationsFromSpec = getHttpOperationsFromSpec;
function isOpenAPI2(document) {
    return (0, lodash_1.get)(document, 'swagger') !== undefined;
}
function isOpenAPI3(document) {
    return (0, lodash_1.get)(document, 'openapi') !== undefined;
}
function isPostmanCollection(document) {
    return Array.isArray((0, lodash_1.get)(document, 'item')) && (0, lodash_1.get)(document, 'info.name') !== undefined;
}
