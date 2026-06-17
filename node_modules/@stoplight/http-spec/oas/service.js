"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformOasService = void 0;
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const guards_1 = require("../guards");
const accessors_1 = require("./accessors");
const externalDocs_1 = require("./externalDocs");
const guards_2 = require("./guards");
const tags_1 = require("./tags");
const translateLogo_1 = require("./transformers/translateLogo");
const transformOasService = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const document = this.document;
    const id = String((_a = document['x-stoplight']) === null || _a === void 0 ? void 0 : _a.id);
    this.ids.service = id;
    this.parentId = id;
    const httpService = {
        id,
        version: (_c = (_b = document.info) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '',
        name: (_e = (_d = document.info) === null || _d === void 0 ? void 0 : _d.title) !== null && _e !== void 0 ? _e : 'no-title',
        ...(0, lodash_1.pickBy)({
            description: (_f = document.info) === null || _f === void 0 ? void 0 : _f.description,
            termsOfService: (_g = document.info) === null || _g === void 0 ? void 0 : _g.termsOfService,
        }, guards_1.isString),
        ...(0, lodash_1.pickBy)({
            contact: (_h = document.info) === null || _h === void 0 ? void 0 : _h.contact,
        }, json_1.isPlainObject),
        ...(0, lodash_1.pickBy)({
            internal: document['x-internal'],
        }, guards_1.isBoolean),
        ...(0, externalDocs_1.toExternalDocs)(document.externalDocs),
        extensions: (0, accessors_1.getExtensions)(document),
        infoExtensions: (0, accessors_1.getExtensions)(document.info),
    };
    if ((0, json_1.isPlainObject)(document.info) && (0, guards_2.hasXLogo)(document.info)) {
        httpService.logo = (0, translateLogo_1.translateLogo)(document.info);
    }
    const tags = Array.isArray(document.tags)
        ? document.tags.map(tags_1.translateTagDefinition, this).filter(guards_1.isNonNullable)
        : [];
    if (tags.length > 0) {
        httpService.tags = tags;
    }
    return httpService;
};
exports.transformOasService = transformOasService;
//# sourceMappingURL=service.js.map