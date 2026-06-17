"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.parseMIMEHeader = void 0;
const types_1 = require("@stoplight/types");
const MIMEType = require("whatwg-mimetype");
const params_1 = require("./params");
const deserializers_1 = require("../deserializers");
function parseMIMEHeader(contentTypeHeader) {
    const mimeType = new MIMEType(contentTypeHeader);
    const multipartBoundary = mimeType.parameters.get('boundary');
    const mediaType = mimeType.essence;
    return [multipartBoundary, mediaType];
}
exports.parseMIMEHeader = parseMIMEHeader;
const validate = (target, specs, context, bundle) => (0, params_1.validateParams)(target, specs, context, bundle)({ deserializers: deserializers_1.header, prefix: 'header', defaultStyle: types_1.HttpParamStyles.Simple });
exports.validate = validate;
