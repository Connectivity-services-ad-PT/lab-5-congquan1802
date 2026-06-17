"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTooComplexGeneratorError = exports.GeneratorError = exports.generateStatic = exports.sortSchemaAlphabetically = exports.generate = exports.resetGenerator = void 0;
const faker_1 = require("@faker-js/faker");
const lodash_1 = require("lodash");
const json_schema_faker_1 = require("json-schema-faker");
const sampler = require("@stoplight/json-schema-sampler");
const Either_1 = require("fp-ts/Either");
const function_1 = require("fp-ts/function");
const E = require("fp-ts/lib/Either");
const filterRequiredProperties_1 = require("../../utils/filterRequiredProperties");
const seedrandom = require("seedrandom");
json_schema_faker_1.JSONSchemaFaker.extend('faker', () => faker_1.default);
const JSON_SCHEMA_FAKER_DEFAULT_OPTIONS = Object.fromEntries([
    ['defaultInvalidTypeProduct', null],
    ['defaultRandExpMax', 10],
    ['pruneProperties', []],
    ['ignoreProperties', []],
    ['ignoreMissingRefs', false],
    ['failOnInvalidTypes', true],
    ['failOnInvalidFormat', true],
    ['alwaysFakeOptionals', false],
    ['optionalsProbability', false],
    ['fixedProbabilities', false],
    ['useExamplesValue', false],
    ['useDefaultValue', false],
    ['requiredOnly', false],
    ['minItems', 0],
    ['maxItems', null],
    ['minLength', 0],
    ['maxLength', null],
    ['refDepthMin', 0],
    ['refDepthMax', 3],
    ['resolveJsonPath', false],
    ['reuseProperties', false],
    ['sortProperties', null],
    ['fillProperties', true],
    ['random', Math.random],
    ['replaceEmptyByRandomValue', false],
    ['omitNulls', false],
]);
function resetGenerator() {
    json_schema_faker_1.JSONSchemaFaker.option({
        ...JSON_SCHEMA_FAKER_DEFAULT_OPTIONS,
        failOnInvalidTypes: false,
        failOnInvalidFormat: false,
        alwaysFakeOptionals: true,
        optionalsProbability: 1,
        fixedProbabilities: true,
        ignoreMissingRefs: true,
    });
}
exports.resetGenerator = resetGenerator;
resetGenerator();
function generate(resource, bundle, source, seed) {
    return (0, function_1.pipe)((0, filterRequiredProperties_1.stripWriteOnlyProperties)(source), E.fromOption(() => Error('Cannot strip writeOnly properties')), E.chain(updatedSource => (0, Either_1.tryCatch)(() => {
        if (seed) {
            json_schema_faker_1.JSONSchemaFaker.option('random', seedrandom(seed));
        }
        return sortSchemaAlphabetically(json_schema_faker_1.JSONSchemaFaker.generate({ ...(0, lodash_1.cloneDeep)(updatedSource), __bundled__: bundle }));
    }, Either_1.toError)));
}
exports.generate = generate;
function sortSchemaAlphabetically(source) {
    if (source && Array.isArray(source)) {
        for (const i of source) {
            if (typeof source[i] === 'object') {
                source[i] = sortSchemaAlphabetically(source[i]);
            }
        }
        return source;
    }
    else if (source && typeof source === 'object') {
        Object.keys(source).forEach((key) => {
            if (typeof source[key] === 'object') {
                source[key] = sortSchemaAlphabetically(source[key]);
            }
        });
        return Object.fromEntries(Object.entries(source).sort());
    }
    return source;
}
exports.sortSchemaAlphabetically = sortSchemaAlphabetically;
function generateStatic(operation, source) {
    return (0, function_1.pipe)((0, Either_1.tryCatch)(() => sampler.sample(source, { ticks: 2500 }, operation), Either_1.toError), E.mapLeft(err => {
        if (err instanceof sampler.SchemaSizeExceededError) {
            return new SchemaTooComplexGeneratorError(operation, err);
        }
        return err;
    }));
}
exports.generateStatic = generateStatic;
class GeneratorError extends Error {
}
exports.GeneratorError = GeneratorError;
class SchemaTooComplexGeneratorError extends GeneratorError {
    constructor(operation, cause) {
        super(`The operation ${operation.method.toUpperCase()} ${operation.path} references a JSON Schema that is too complex to generate.`);
        this.cause = cause;
    }
}
exports.SchemaTooComplexGeneratorError = SchemaTooComplexGeneratorError;
