"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceValidation = exports.sequenceOption = void 0;
const O = require("fp-ts/Option");
const Apply_1 = require("fp-ts/Apply");
const NonEmptyArray_1 = require("fp-ts/NonEmptyArray");
const Either_1 = require("fp-ts/Either");
exports.sequenceOption = (0, Apply_1.sequenceT)(O.Apply);
exports.sequenceValidation = (0, Apply_1.sequenceT)((0, Either_1.getApplicativeValidation)((0, NonEmptyArray_1.getSemigroup)()));
