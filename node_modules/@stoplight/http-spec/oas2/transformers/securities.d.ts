import type { HttpSecurityScheme, IApiKeySecurityScheme, IBasicSecurityScheme, IOauth2SecurityScheme, IOauthFlowObjects, Optional } from '@stoplight/types';
import type { ApiKeySecurity, BasicAuthenticationSecurity, OAuth2AccessCodeSecurity, OAuth2ApplicationSecurity, OAuth2ImplicitSecurity, OAuth2PasswordSecurity } from 'swagger-schema-official';
import { ArrayCallbackParameters, HttpSecurityKind } from '../../types';
import type { Oas2TranslateFunction } from '../types';
export declare const translateToFlows: Oas2TranslateFunction<[security: Record<string, unknown>], IOauthFlowObjects>;
export declare const translateToBasicSecurityScheme: Oas2TranslateFunction<[security: import("utility-types/dist/mapped-types")._DeepPartialObject<BasicAuthenticationSecurity> & {
    key: string;
}, kind: HttpSecurityKind, index: number], IBasicSecurityScheme>;
export declare const translateToApiKeySecurityScheme: Oas2TranslateFunction<[security: import("utility-types/dist/mapped-types")._DeepPartialObject<ApiKeySecurity> & {
    key: string;
}, kind: HttpSecurityKind, index: number], Optional<IApiKeySecurityScheme>>;
export declare const translateToOauth2SecurityScheme: Oas2TranslateFunction<[security: (import("utility-types/dist/mapped-types")._DeepPartialObject<OAuth2AccessCodeSecurity> | import("utility-types/dist/mapped-types")._DeepPartialObject<OAuth2ApplicationSecurity> | import("utility-types/dist/mapped-types")._DeepPartialObject<OAuth2ImplicitSecurity> | import("utility-types/dist/mapped-types")._DeepPartialObject<OAuth2PasswordSecurity>) & {
    key: string;
}, kind: HttpSecurityKind, index: number], Optional<IOauth2SecurityScheme>>;
export declare const translateToSingleSecurity: Oas2TranslateFunction<[
    HttpSecurityKind,
    ...ArrayCallbackParameters<unknown & {
        key: string;
    }>
], Optional<HttpSecurityScheme>>;
export declare const translateToSecurities: Oas2TranslateFunction<[operationSecurities: unknown, kind: HttpSecurityKind], HttpSecurityScheme[][]>;
