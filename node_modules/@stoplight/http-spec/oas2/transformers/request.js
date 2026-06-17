"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToRequest = void 0;
const lodash_1 = require("lodash");
const guards_1 = require("../../guards");
const oas_1 = require("../../oas");
const accessors_1 = require("../../oas/accessors");
const guards_2 = require("../../oas/guards");
const resolver_1 = require("../../oas/resolver");
const accessors_2 = require("../accessors");
const guards_3 = require("../guards");
const params_1 = require("./params");
const iterateOasParams = (0, accessors_1.createOasParamsIterator)(oas_1.OasVersion.OAS2);
const translateToRequest = function (path, operation) {
    var _a;
    const consumes = (0, accessors_2.getConsumes)(this.document, operation);
    const parameters = iterateOasParams.call(this, path, operation);
    const params = {
        headers: [],
        query: [],
        cookie: [],
        path: [],
        unknown: [],
    };
    let bodyParameter;
    const formDataParameters = [];
    for (const param of parameters) {
        if ((0, guards_2.isReferenceObject)(param)) {
            const kind = (_a = (0, resolver_1.getComponentName)(this.references, param.$ref)) !== null && _a !== void 0 ? _a : '';
            const target = params[kind === 'header' ? 'headers' : kind || 'unknown'];
            if (Array.isArray(target)) {
                target.push((0, resolver_1.syncReferenceObject)(param, this.references));
            }
            continue;
        }
        if ((0, guards_3.isQueryParam)(param)) {
            params.query.push(params_1.translateToQueryParameter.call(this, param));
        }
        else if ((0, guards_3.isPathParam)(param)) {
            params.path.push(params_1.translateToPathParameter.call(this, param));
        }
        else if ((0, guards_3.isHeaderParam)(param)) {
            params.headers.push(params_1.translateToHeaderParam.call(this, param));
        }
        else if ((0, guards_3.isBodyParam)(param)) {
            bodyParameter = params_1.translateToBodyParameter.call(this, param, consumes);
        }
        else if ((0, guards_3.isFormDataParam)(param)) {
            formDataParameters.push(param);
        }
    }
    let body;
    if (!!bodyParameter) {
        body = bodyParameter;
    }
    else if (!!formDataParameters.length) {
        body = params_1.translateFromFormDataParameters.call(this, formDataParameters, consumes);
    }
    if (params.unknown && !params.unknown.length) {
        delete params.unknown;
    }
    return {
        ...params,
        ...(0, lodash_1.pickBy)({
            body,
        }, guards_1.isNonNullable),
    };
};
exports.translateToRequest = translateToRequest;
//# sourceMappingURL=request.js.map