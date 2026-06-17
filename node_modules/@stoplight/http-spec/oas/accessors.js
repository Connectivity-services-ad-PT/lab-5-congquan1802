"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensions = exports.createOasParamsIterator = void 0;
const utils_1 = require("../utils");
const guards_1 = require("./guards");
const types_1 = require("./types");
const ROOT_EXTENSIONS = ['x-internal'];
const getIdForParameter = (param) => `${param.name}-${param.in}`;
function createOasParamsIterator(spec) {
    return function* (path, operation) {
        var _a;
        const seenParams = new Set();
        const { parentId, context } = this;
        const opParams = Array.isArray(operation.parameters) ? operation.parameters : [];
        const pathParams = Array.isArray(path.parameters) ? path.parameters : [];
        const params = [...opParams, ...pathParams];
        for (let i = 0; i < params.length; i++) {
            this.context = i < opParams.length ? 'operation' : 'path';
            this.parentId = this.ids[this.context];
            const maybeParameterObject = (_a = this.maybeResolveLocalRef(params[i])) !== null && _a !== void 0 ? _a : params[i];
            if ((0, guards_1.isReferenceObject)(maybeParameterObject)) {
                yield params[i];
                this.context = context;
                this.parentId = parentId;
                continue;
            }
            if (!(spec === types_1.OasVersion.OAS2 ? guards_1.isValidOas2ParameterObject : guards_1.isValidOas3ParameterObject)(maybeParameterObject)) {
                this.context = context;
                this.parentId = parentId;
                continue;
            }
            const key = getIdForParameter(maybeParameterObject);
            if (seenParams.has(key)) {
                this.context = context;
                this.parentId = parentId;
                continue;
            }
            seenParams.add(key);
            yield maybeParameterObject;
        }
        this.context = context;
        this.parentId = parentId;
    };
}
exports.createOasParamsIterator = createOasParamsIterator;
function getExtensions(target) {
    return Object.fromEntries((0, utils_1.entries)(target).filter(([key]) => key.startsWith('x-') && !ROOT_EXTENSIONS.includes(key)));
}
exports.getExtensions = getExtensions;
//# sourceMappingURL=accessors.js.map