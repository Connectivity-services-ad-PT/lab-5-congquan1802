import { DeepPartial, HttpParamStyles, Reference } from '@stoplight/types';
import type * as OAS3 from 'openapi3-ts';
import type * as OAS2 from 'swagger-schema-official';
import type { Oas2ParamBase, Oas3ParamBase, ParamBase } from './types';
export declare function hasXLogo(info: DeepPartial<OAS2.Info | OAS3.InfoObject>): info is DeepPartial<OAS2.Info | OAS3.InfoObject> & {
    'x-logo': Record<string, unknown>;
};
export declare const isValidParameterObject: (param: unknown) => param is ParamBase;
export declare const isValidOas2ParameterObject: (param: unknown) => param is Oas2ParamBase;
export declare const isValidOas3ParameterObject: (param: unknown) => param is Oas3ParamBase;
export declare const isValidOas3ParamStyle: (style: unknown) => style is HttpParamStyles;
export declare function isReferenceObject(maybeReferenceObject: unknown): maybeReferenceObject is Reference;
