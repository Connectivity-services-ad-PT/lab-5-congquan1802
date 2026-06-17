"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentHasExamples = exports.findDefaultResponse = exports.findResponseByStatusCode = exports.findFirstResponse = exports.findLowest2XXResponse = exports.findDefaultContentType = exports.findBestHttpContentByMediaType = exports.findExampleByKey = exports.findFirstExample = void 0;
const accepts = require("accepts");
const contentType = require("content-type");
const O = require("fp-ts/Option");
const A = require("fp-ts/Array");
const S = require("fp-ts/string");
const NEA = require("fp-ts/NonEmptyArray");
const Ord = require("fp-ts/Ord");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
function findFirstExample(httpContent) {
    return (0, function_1.pipe)(O.fromNullable(httpContent.examples), O.chain(NEA.fromArray), O.chain(A.head));
}
exports.findFirstExample = findFirstExample;
function findExampleByKey(httpContent, exampleKey) {
    return (0, function_1.pipe)(O.fromNullable(httpContent.examples), O.chain(A.findFirst(({ key }) => key === exampleKey)));
}
exports.findExampleByKey = findExampleByKey;
function findBestHttpContentByMediaType(contents, mediaTypes) {
    const bestType = accepts({ headers: { accept: mediaTypes.join(',') } }).type(contents.map(c => c.mediaType));
    return (0, function_1.pipe)(bestType, O.fromPredicate((bestType) => !!bestType), O.chain(bestType => A.findFirst(content => content.mediaType === bestType)(contents)), O.alt(() => (0, function_1.pipe)(mediaTypes
        .map(mt => contentType.parse(mt))
        .filter(({ parameters }) => Object.keys(parameters).some(k => k !== 'q'))
        .map(({ type, parameters }) => ({ type, parameters: (0, lodash_1.pick)(parameters, 'q') }))
        .map(mt => contentType.format(mt)), NEA.fromArray, O.chain(mediaTypesWithNoParameters => findBestHttpContentByMediaType(contents, mediaTypesWithNoParameters)))));
}
exports.findBestHttpContentByMediaType = findBestHttpContentByMediaType;
function findDefaultContentType(contents) {
    return (0, function_1.pipe)(contents, A.findFirst(content => content.mediaType === '*/*'));
}
exports.findDefaultContentType = findDefaultContentType;
function findLowest2XXResponse(httpResponses) {
    return (0, function_1.pipe)(httpResponses, A.filter(response => /^2(\d\d|XX)$/.test(response.code)), A.sort(Ord.contramap((response) => response.code)(S.Ord)), A.head, O.map(withResponseRangesNormalized));
}
exports.findLowest2XXResponse = findLowest2XXResponse;
function findFirstResponse(httpResponses) {
    return (0, function_1.pipe)(httpResponses, A.head, O.map(withResponseRangesNormalized));
}
exports.findFirstResponse = findFirstResponse;
function findResponseByStatusCode(httpResponses, statusCode) {
    return (0, function_1.pipe)(httpResponses, A.findFirst(response => response.code.toLowerCase() === String(statusCode)), O.alt(() => (0, function_1.pipe)(httpResponses, A.findFirst(response => response.code === `${String(statusCode).charAt(0)}XX`), O.map(response => ({ ...response, code: statusCode.toString() })))));
}
exports.findResponseByStatusCode = findResponseByStatusCode;
function findDefaultResponse(httpResponses, statusCode = 200) {
    return (0, function_1.pipe)(httpResponses, A.findFirst(response => response.code === 'default'), O.map(response => ({ ...response, code: statusCode.toString() })));
}
exports.findDefaultResponse = findDefaultResponse;
function contentHasExamples(content) {
    return !!content.examples && content.examples.length !== 0;
}
exports.contentHasExamples = contentHasExamples;
function withResponseRangesNormalized(httpResponse) {
    return /^\dXX$/.test(httpResponse.code)
        ? { ...httpResponse, code: `${httpResponse.code.charAt(0)}00` }
        : httpResponse;
}
