"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndCallPrismInstanceWithSpec = void 0;
const index_1 = require("./index");
const operations_1 = require("./utils/operations");
const function_1 = require("fp-ts/function");
const Either_1 = require("fp-ts/lib/Either");
async function createAndCallPrismInstanceWithSpec(spec, options, request, logger) {
    const operations = await (0, operations_1.getHttpOperationsFromSpec)(spec);
    const prism = (0, index_1.createInstance)(options, { logger });
    const result = await (0, function_1.pipe)(prism.request(request, operations))();
    if ((0, Either_1.isRight)(result)) {
        return { result: 'ok', response: result.right };
    }
    if ((0, Either_1.isLeft)(result)) {
        return { result: 'error', error: result.left };
    }
    throw new Error('Unexpected Result');
}
exports.createAndCallPrismInstanceWithSpec = createAndCallPrismInstanceWithSpec;
