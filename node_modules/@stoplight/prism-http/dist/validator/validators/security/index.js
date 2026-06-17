"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSecurity = void 0;
const E = require("fp-ts/Either");
const O = require("fp-ts/Option");
const function_1 = require("fp-ts/function");
const lodash_1 = require("lodash");
const fp_1 = require("lodash/fp");
const handlers_1 = require("./handlers");
const NonEmptyArray_1 = require("fp-ts/NonEmptyArray");
const Array_1 = require("fp-ts/Array");
const EitherAltValidation = E.getAltValidation((0, NonEmptyArray_1.getSemigroup)());
const EitherApplicativeValidation = E.getApplicativeValidation((0, NonEmptyArray_1.getSemigroup)());
const eitherSequence = (0, Array_1.sequence)(EitherApplicativeValidation);
function getValidationResults(securitySchemes, input) {
    const [first, ...others] = getAuthenticationArray(securitySchemes, input);
    return others.reduce((prev, current) => EitherAltValidation.alt(prev, () => current), first);
}
function setErrorTag(authResults) {
    const tags = authResults.map(authResult => authResult.tags || []);
    return (0, fp_1.set)(['tags'], (0, lodash_1.flatten)(tags), authResults[0]);
}
function getAuthenticationArray(securitySchemes, input) {
    return securitySchemes.map(securitySchemePairs => {
        const authResults = securitySchemePairs.map(securityScheme => (0, function_1.pipe)((0, handlers_1.findSecurityHandler)(securityScheme), E.chain(securityHandler => securityHandler(input, 'name' in securityScheme ? securityScheme.name : '')), E.mapLeft(e => [e])));
        if (securitySchemePairs.length === 0) {
            const optionalCheck = (0, function_1.pipe)((0, handlers_1.noneSecurityHandler)(input), E.mapLeft(e => [e]));
            authResults.push(optionalCheck);
        }
        return eitherSequence(authResults);
    });
}
const validateSecurity = ({ element, resource }) => (0, function_1.pipe)(O.fromNullable(resource.security), O.chain(O.fromPredicate(Array_1.isNonEmpty)), O.fold(() => E.right(element), securitySchemes => (0, function_1.pipe)(getValidationResults(securitySchemes, element), E.bimap(e => [setErrorTag(e)], () => element))));
exports.validateSecurity = validateSecurity;
