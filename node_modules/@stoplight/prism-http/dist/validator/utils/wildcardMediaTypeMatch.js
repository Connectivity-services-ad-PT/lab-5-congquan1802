"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildcardMediaTypeMatch = void 0;
const content_type_1 = require("content-type");
const O = require("fp-ts/Option");
const function_1 = require("fp-ts/function");
function wildcardMediaTypeMatch(mediaTypeA, mediaTypeB) {
    return (0, function_1.pipe)(O.Do, O.bind('a', () => parseContentType(mediaTypeA)), O.bind('b', () => parseContentType(mediaTypeB)), O.fold(() => false, ({ a, b }) => {
        return (a.type === b.type || b.type === '*') && (a.subtype === b.subtype || b.subtype === '*');
    }));
}
exports.wildcardMediaTypeMatch = wildcardMediaTypeMatch;
const CONTENT_TYPE_REGEXP = /^(.+)\/(?:(.+)\+)?(.+)$/;
function parseContentType(contentType) {
    return (0, function_1.pipe)(O.tryCatch(() => (0, content_type_1.parse)(contentType)), O.chain(({ type }) => {
        const match = CONTENT_TYPE_REGEXP.exec(type.toLowerCase());
        if (!match) {
            return O.none;
        }
        const hasExtension = match.length === 4;
        return O.some({
            type: match[1],
            subtype: match[hasExtension ? 3 : 2],
            suffix: hasExtension ? match[2] : undefined,
        });
    }));
}
