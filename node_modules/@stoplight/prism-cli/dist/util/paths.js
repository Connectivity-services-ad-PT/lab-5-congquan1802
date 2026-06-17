"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExamplePath = void 0;
const prism_http_1 = require("@stoplight/prism-http");
const types_1 = require("@stoplight/types");
const A = require("fp-ts/Array");
const E = require("fp-ts/Either");
const O = require("fp-ts/Option");
const ROA = require("fp-ts/ReadonlyArray");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const uri_template_lite_1 = require("uri-template-lite");
const combinators_1 = require("../combinators");
function createExamplePath(operation, transformValues = lodash_1.identity) {
    return (0, function_1.pipe)(E.Do, E.bind('pathData', () => generateTemplateAndValuesForPathParams(operation)), E.bind('queryData', ({ pathData }) => generateTemplateAndValuesForQueryParams(pathData.template, operation)), E.map(({ pathData, queryData }) => uri_template_lite_1.URI.expand(queryData.template, transformValues({ ...pathData.values, ...queryData.values }))), E.map(path => path.replace(/\?$/, '')));
}
exports.createExamplePath = createExamplePath;
function generateParamValue(spec) {
    return (0, function_1.pipe)((0, prism_http_1.generateHttpParam)(spec), E.fromOption(() => new Error(`Cannot generate value for: ${spec.name}`)), E.chain(value => {
        switch (spec.style) {
            case types_1.HttpParamStyles.DeepObject:
                return (0, function_1.pipe)(value, E.fromPredicate((value) => typeof value === 'string' || typeof value === 'object', () => new Error('Expected string parameter')), E.map(value => (0, prism_http_1.serializeWithDeepObjectStyle)(spec.name, value)));
            case types_1.HttpParamStyles.PipeDelimited:
                return (0, function_1.pipe)(value, E.fromPredicate(Array.isArray, () => new Error('Pipe delimited style is only applicable to array parameter')), E.map(v => (0, prism_http_1.serializeWithPipeDelimitedStyle)(spec.name, v, spec.explode)));
            case types_1.HttpParamStyles.SpaceDelimited:
                return (0, function_1.pipe)(value, E.fromPredicate(Array.isArray, () => new Error('Space delimited style is only applicable to array parameter')), E.map(v => (0, prism_http_1.serializeWithSpaceDelimitedStyle)(spec.name, v, spec.explode)));
            default:
                return E.right(value);
        }
    }));
}
function generateParamValues(specs) {
    return (0, function_1.pipe)(specs, A.map(O.fromNullable), A.compact, E.traverseArray(spec => (0, function_1.pipe)(generateParamValue(spec), E.map(value => [encodeURI(spec.name), value]), E.map(O.fromPredicate(([_, value]) => value !== null)))), E.map(ROA.compact), E.map(lodash_1.fromPairs));
}
function generateTemplateAndValuesForPathParams(operation) {
    var _a;
    const specs = ((_a = operation.request) === null || _a === void 0 ? void 0 : _a.path) || [];
    return (0, combinators_1.sequenceSEither)({
        values: generateParamValues(specs),
        template: createPathUriTemplate(operation.path, specs),
    });
}
function generateTemplateAndValuesForQueryParams(template, operation) {
    var _a;
    const specs = ((_a = operation.request) === null || _a === void 0 ? void 0 : _a.query) || [];
    return (0, function_1.pipe)(generateParamValues(specs), E.map(values => ({ template: createQueryUriTemplate(template, specs), values })));
}
function createPathUriTemplate(inputPath, specs) {
    return (0, function_1.pipe)(specs.filter(spec => spec.required !== false), E.traverseArray(spec => (0, function_1.pipe)(createParamUriTemplate(spec.name, spec.style || types_1.HttpParamStyles.Simple, spec.explode || false), E.map(param => ({ param, name: spec.name })))), E.map(values => values.reduce((acc, current) => acc.replace(`{${current.name}}`, current.param), inputPath)));
}
function createParamUriTemplate(name, style, explode) {
    const starOrVoid = explode ? '*' : '';
    switch (style) {
        case types_1.HttpParamStyles.Simple:
            return E.right(`{${name}${starOrVoid}}`);
        case types_1.HttpParamStyles.Label:
            return E.right(`{.${name}${starOrVoid}}`);
        case types_1.HttpParamStyles.Matrix:
            return E.right(`{;${name}${starOrVoid}}`);
        default:
            return E.left(new Error(`Unsupported parameter style: ${style}`));
    }
}
function createQueryUriTemplate(path, specs) {
    const formSpecs = specs
        .filter(spec => (spec.style || types_1.HttpParamStyles.Form) === types_1.HttpParamStyles.Form)
        .map(spec => {
        spec.name = encodeURI(spec.name);
        if (spec.explode === undefined) {
            spec.explode = true;
        }
        return spec;
    });
    const formExplodedParams = formSpecs
        .filter(spec => spec.required !== false)
        .filter(spec => spec.explode)
        .map(spec => spec.name)
        .join(',');
    const formImplodedParams = formSpecs
        .filter(spec => spec.required !== false)
        .filter(spec => !spec.explode)
        .map(spec => spec.name)
        .join(',');
    const restParams = specs
        .filter(spec => spec.required !== false)
        .filter(spec => [types_1.HttpParamStyles.DeepObject, types_1.HttpParamStyles.SpaceDelimited, types_1.HttpParamStyles.PipeDelimited].includes(spec.style))
        .map(spec => spec.name)
        .map(name => `{+${name}}`)
        .join('&');
    if (formExplodedParams) {
        path += `{?${formExplodedParams}*}`;
    }
    if (formImplodedParams) {
        path += `{${formExplodedParams ? '&' : '?'}${formImplodedParams}}`;
    }
    if (restParams) {
        path += `${formExplodedParams || formImplodedParams ? '&' : '?'}${restParams}`;
    }
    return path;
}
