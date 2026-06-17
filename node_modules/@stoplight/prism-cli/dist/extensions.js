"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureExtensionsUserProvided = void 0;
const $RefParser = require("@stoplight/json-schema-ref-parser");
const json_1 = require("@stoplight/json");
const lodash_1 = require("lodash");
const json_schema_faker_1 = require("json-schema-faker");
const prism_http_1 = require("@stoplight/prism-http");
async function configureExtensionsUserProvided(specFilePathOrObject, cliParamOptions) {
    const result = (0, json_1.decycle)(await new $RefParser().dereference(specFilePathOrObject));
    (0, prism_http_1.resetJSONSchemaGenerator)();
    (0, lodash_1.forOwn)((0, lodash_1.get)(result, 'x-json-schema-faker', {}), (value, option) => {
        setFakerValue(option, value);
    });
    for (const param in cliParamOptions) {
        if (cliParamOptions[param] !== undefined) {
            setFakerValue(param, cliParamOptions[param]);
        }
    }
}
exports.configureExtensionsUserProvided = configureExtensionsUserProvided;
function setFakerValue(option, value) {
    if (option === 'locale') {
        return json_schema_faker_1.JSONSchemaFaker.locate('faker').setLocale(value);
    }
    json_schema_faker_1.JSONSchemaFaker.option((0, lodash_1.camelCase)(option), value);
}
