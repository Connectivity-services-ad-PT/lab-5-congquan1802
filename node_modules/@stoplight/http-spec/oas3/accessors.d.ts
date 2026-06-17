import type { DeepPartial, Dictionary, HttpSecurityScheme } from '@stoplight/types';
import type { OpenAPIObject, SecuritySchemeObject } from 'openapi3-ts';
export declare type OperationSecurities = Dictionary<string[], string>[] | undefined;
export declare function getSecurities(document: DeepPartial<OpenAPIObject>, operationSecurities?: unknown): [key: string, security: Omit<HttpSecurityScheme, 'key' | 'id'>][][];
export declare function getScopeKeys(scheme: Omit<SecuritySchemeObject, 'type'>): string[] | undefined;
