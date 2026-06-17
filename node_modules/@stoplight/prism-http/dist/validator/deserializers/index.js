"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.body = exports.path = exports.query = exports.header = void 0;
const simple_1 = require("./style/simple");
const form_1 = require("./style/form");
const deepObject_1 = require("./style/deepObject");
const label_1 = require("./style/label");
const matrix_1 = require("./style/matrix");
const delimited_1 = require("./style/delimited");
exports.header = { simple: simple_1.deserializeSimpleStyle };
exports.query = {
    form: form_1.deserializeFormStyle,
    spaceDelimited: (0, delimited_1.createDelimitedDeserializerStyle)('%20'),
    pipeDelimited: (0, delimited_1.createDelimitedDeserializerStyle)('|'),
    commaDelimited: (0, delimited_1.createDelimitedDeserializerStyle)(','),
    deepObject: deepObject_1.deserializeDeepObjectStyle,
    simple: form_1.deserializeFormStyle,
    unspecified: form_1.deserializeFormStyle,
};
exports.path = { simple: simple_1.deserializeSimpleStyle, label: label_1.deserializeLabelStyle, matrix: matrix_1.deserializeMatrixStyle };
exports.body = exports.query;
