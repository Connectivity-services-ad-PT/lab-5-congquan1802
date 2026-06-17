"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToCallbacks = void 0;
const context_1 = require("../../oas/context");
const guards_1 = require("../../oas/guards");
const operation_1 = require("../../oas/operation");
const utils_1 = require("../../utils");
const operation_2 = require("../operation");
const translateToCallbacks = function (callbacks) {
    const callbackEntries = (0, utils_1.entries)(callbacks);
    if (!callbackEntries.length)
        return;
    return callbackEntries.reduce((results, [callbackName, path2Methods]) => {
        if ((0, guards_1.isReferenceObject)(path2Methods)) {
            results.push({ key: callbackName, ...path2Methods });
        }
        for (const [path, method2Op] of (0, utils_1.entries)(path2Methods)) {
            for (const [method, op] of (0, utils_1.entries)(method2Op)) {
                const document = {
                    openapi: '3',
                    info: { title: '', version: '1' },
                    paths: { [path]: { [method]: op } },
                };
                const ctx = (0, context_1.createContext)(document);
                ctx.context = 'callback';
                Object.assign(ctx.ids, this.ids);
                ctx.ids.operation = this.generateId.httpCallbackOperation({
                    parentId: this.ids.service,
                    method,
                    path,
                    key: callbackName,
                });
                results.push({
                    ...(0, operation_2.transformOas3Operation)({
                        document,
                        method,
                        name: path,
                        key: callbackName,
                        config: operation_1.OPERATION_CONFIG,
                        ctx,
                    }),
                    key: callbackName,
                });
            }
        }
        return results;
    }, []);
};
exports.translateToCallbacks = translateToCallbacks;
//# sourceMappingURL=callbacks.js.map