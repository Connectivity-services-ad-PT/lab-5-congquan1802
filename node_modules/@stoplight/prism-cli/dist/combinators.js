"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceSEither = void 0;
const E = require("fp-ts/Either");
const Apply_1 = require("fp-ts/Apply");
exports.sequenceSEither = (0, Apply_1.sequenceS)(E.Apply);
