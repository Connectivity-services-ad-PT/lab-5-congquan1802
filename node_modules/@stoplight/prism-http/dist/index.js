"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstance = exports.createAndCallPrismInstanceWithSpec = exports.getHttpOperationsFromSpec = exports.resetJSONSchemaGenerator = exports.generateHttpParam = void 0;
const tslib_1 = require("tslib");
const prism_core_1 = require("@stoplight/prism-core");
const lodash_1 = require("lodash");
const forwarder_1 = require("./forwarder");
const mocker_1 = require("./mocker");
const router_1 = require("./router");
const validator_1 = require("./validator");
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./mocker/errors"), exports);
tslib_1.__exportStar(require("./router/errors"), exports);
tslib_1.__exportStar(require("./mocker/serializer/style"), exports);
var HttpParamGenerator_1 = require("./mocker/generator/HttpParamGenerator");
Object.defineProperty(exports, "generateHttpParam", { enumerable: true, get: function () { return HttpParamGenerator_1.generate; } });
var mocker_2 = require("./mocker");
Object.defineProperty(exports, "resetJSONSchemaGenerator", { enumerable: true, get: function () { return mocker_2.resetJSONSchemaGenerator; } });
var operations_1 = require("./utils/operations");
Object.defineProperty(exports, "getHttpOperationsFromSpec", { enumerable: true, get: function () { return operations_1.getHttpOperationsFromSpec; } });
var instanceWithSpec_1 = require("./instanceWithSpec");
Object.defineProperty(exports, "createAndCallPrismInstanceWithSpec", { enumerable: true, get: function () { return instanceWithSpec_1.createAndCallPrismInstanceWithSpec; } });
const createInstance = (defaultConfig, components) => (0, prism_core_1.factory)(defaultConfig, (0, lodash_1.defaults)(components, {
    route: router_1.default,
    validateInput: validator_1.validateInput,
    validateOutput: validator_1.validateOutput,
    validateSecurity: validator_1.validateSecurity,
    mock: mocker_1.default,
    forward: forwarder_1.default,
}));
exports.createInstance = createInstance;
