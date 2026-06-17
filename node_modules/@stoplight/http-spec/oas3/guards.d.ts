import type { BaseParameterObject, HeaderObject, OAuthFlowObject, RequestBodyObject, ResponseObject, SecuritySchemeObject, ServerObject, ServerVariableObject } from 'openapi3-ts';
export declare const isSecurityScheme: (maybeSecurityScheme: unknown) => maybeSecurityScheme is SecuritySchemeObject;
export declare const isBaseParameterObject: (maybeBaseParameterObject: unknown) => maybeBaseParameterObject is BaseParameterObject;
export declare const isHeaderObject: (maybeHeaderObject: unknown) => maybeHeaderObject is HeaderObject;
export declare const isServerObject: (maybeServerObject: unknown) => maybeServerObject is ServerObject;
export declare const isServerVariableObject: (maybeServerVariableObject: unknown) => maybeServerVariableObject is ServerVariableObject;
export declare const isResponseObject: (maybeResponseObject: unknown) => maybeResponseObject is ResponseObject;
export declare const isOAuthFlowObject: (maybeOAuthFlowObject: unknown) => maybeOAuthFlowObject is OAuthFlowObject;
export declare const isRequestBodyObject: (maybeRequestBodyObject: unknown) => maybeRequestBodyObject is RequestBodyObject;
