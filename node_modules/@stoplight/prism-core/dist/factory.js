"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
const E = require("fp-ts/Either");
const A = require("fp-ts/Array");
const TE = require("fp-ts/TaskEither");
const lodash_1 = require("lodash");
const function_1 = require("fp-ts/function");
const lodash_2 = require("lodash");
const NonEmptyArray_1 = require("fp-ts/NonEmptyArray");
const types_1 = require("@stoplight/types");
const function_2 = require("fp-ts/function");
const eitherSequence = A.sequence(E.getApplicativeValidation((0, NonEmptyArray_1.getSemigroup)()));
function isProxyConfig(p) {
    return p.isProxy;
}
function createWarningOutput(output) {
    return {
        output,
        validations: {
            input: [
                {
                    message: 'Selected route not found',
                    severity: types_1.DiagnosticSeverity.Warning,
                },
            ],
            output: [],
        },
    };
}
function factory(defaultConfig, components) {
    const inputValidation = (resource, input, config) => {
        const validations = (0, lodash_1.compact)([
            config.checkSecurity ? components.validateSecurity({ resource, element: input }) : undefined,
            config.validateRequest ? components.validateInput({ resource, element: input }) : undefined,
        ]);
        return (0, function_1.pipe)(eitherSequence(validations), E.fold(function_2.identity, () => []), validations => E.right({ resource, validations }));
    };
    const mockOrForward = (resource, data, config, validations) => {
        const mockCall = () => components.mock({
            resource,
            input: { data, validations },
            config: config.mock || {},
        })(components.logger.child({ name: 'NEGOTIATOR' }));
        const forwardCall = (config) => components.forward({
            validations: config.errors ? validations : [],
            data,
        }, config.upstream.href, config.upstreamProxy, resource);
        const produceOutput = isProxyConfig(config)
            ? (0, function_1.pipe)(forwardCall(config)(components.logger.child({ name: 'PROXY' })), TE.orElse(error => {
                if (error.name === 'https://stoplight.io/prism/errors#UPSTREAM_NOT_IMPLEMENTED') {
                    components.logger.info('Remocking the call');
                    return TE.fromIOEither(mockCall);
                }
                return TE.left(error);
            }))
            : TE.fromIOEither(mockCall);
        return (0, function_1.pipe)(produceOutput, TE.map(output => ({ output, resource, validations })));
    };
    return {
        request: (input, resources, c) => {
            const config = (0, lodash_2.defaults)(c, defaultConfig);
            return (0, function_1.pipe)(components.route({ resources, input }), E.fold(error => {
                if (!config.errors && isProxyConfig(config)) {
                    return (0, function_1.pipe)(components.forward({ data: input, validations: [] }, config.upstream.href, config.upstreamProxy)(components.logger.child({ name: 'PROXY' })), TE.map(createWarningOutput));
                }
                else
                    return TE.left(error);
            }, resource => (0, function_1.pipe)(TE.fromEither(inputValidation(resource, input, config)), TE.chain(({ resource, validations }) => mockOrForward(resource, input, config, validations)), TE.map(({ output, resource, validations: inputValidations }) => {
                const outputValidations = config.validateResponse
                    ? (0, function_1.pipe)(E.swap(components.validateOutput({ resource, element: output })), E.getOrElse(() => []))
                    : [];
                return {
                    output,
                    validations: {
                        input: inputValidations,
                        output: outputValidations,
                    },
                };
            }))));
        },
    };
}
exports.factory = factory;
