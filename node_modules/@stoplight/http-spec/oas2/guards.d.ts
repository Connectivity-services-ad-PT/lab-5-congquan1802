import type { Response, Security } from 'swagger-schema-official';
import type { Oas2ParamBase } from '../oas/types';
export declare function isSecurityScheme(maybeSecurityScheme: unknown): maybeSecurityScheme is Security;
export declare const isResponseObject: (maybeResponseObject: unknown) => maybeResponseObject is Response;
export declare function isValidScheme(scheme: unknown): scheme is 'http' | 'https' | 'ws' | 'wss';
export declare function isQueryParam(param: unknown): param is Oas2ParamBase & {
    in: 'query';
};
export declare function isPathParam(param: unknown): param is Oas2ParamBase & {
    in: 'path';
};
export declare function isHeaderParam(param: unknown): param is Oas2ParamBase & {
    in: 'header';
};
export declare function isBodyParam(param: unknown): param is Oas2ParamBase & {
    in: 'body';
};
export declare function isFormDataParam(param: unknown): param is Oas2ParamBase & {
    in: 'formData';
};
