import type { Optional } from '@stoplight/types';
import { HttpSecurityScheme } from '@stoplight/types';
import type { SecuritySchemeObject } from 'openapi3-ts';
import { HttpSecurityKind } from '../../types';
import { Oas3TranslateFunction } from '../types';
export declare const translateToSecurities: Oas3TranslateFunction<[
    operationSecurities: unknown,
    kind: HttpSecurityKind
], HttpSecurityScheme[][]>;
export declare const translateToSingleSecurity: Oas3TranslateFunction<[HttpSecurityKind, [key: string, security: SecuritySchemeObject | (Omit<SecuritySchemeObject, "type"> & {
    type: 'mutualTLS';
})], number, [key: string, security: SecuritySchemeObject | (Omit<SecuritySchemeObject, "type"> & {
    type: 'mutualTLS';
})][]], Optional<HttpSecurityScheme>>;
