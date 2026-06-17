import { IBundledHttpService, IHttpHeaderParam, IHttpOperationRequestBody, IHttpPathParam, IHttpQueryParam, Reference } from '@stoplight/types';
import type { BodyParameter, FormDataParameter } from 'swagger-schema-official';
import { Fragment } from '../../types';
import { Oas2TranslateFunction } from '../types';
export declare const translateToHeaderParam: Oas2TranslateFunction<[param: (import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").GenericFormat & import("swagger-schema-official").BaseSchema & {
    in: "header";
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").IntegerFormat & import("swagger-schema-official").BaseSchema & {
    in: "header";
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").NumberFormat & import("swagger-schema-official").BaseSchema & {
    in: "header";
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").StringFormat & import("swagger-schema-official").BaseSchema & {
    in: "header";
}>) & {
    name: string;
    in: string;
} & Record<string, unknown> & {
    in: "path" | "header" | "body" | "query" | "formData";
} & {
    in: 'header';
}], IHttpHeaderParam<true>>;
export declare const translateToHeaderParams: Oas2TranslateFunction<[
    headers: unknown
], (IHttpHeaderParam<true> | (Pick<IHttpHeaderParam<true>, 'name'> & Reference))[]>;
export declare const translateToBodyParameter: Oas2TranslateFunction<[body: BodyParameter, consumes: string[]], IHttpOperationRequestBody<false>>;
export declare const translateFromFormDataParameters: Oas2TranslateFunction<[parameters: ({
    name: string;
    in: string;
} & Record<string, unknown> & {
    in: "path" | "header" | "body" | "query" | "formData";
} & Partial<FormDataParameter>)[], consumes: string[]], IHttpOperationRequestBody<false>>;
export declare const translateToQueryParameter: Oas2TranslateFunction<[query: (import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").GenericFormat & import("swagger-schema-official").BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: import("swagger-schema-official").ParameterCollectionFormat | undefined;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").IntegerFormat & import("swagger-schema-official").BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: import("swagger-schema-official").ParameterCollectionFormat | undefined;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").NumberFormat & import("swagger-schema-official").BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: import("swagger-schema-official").ParameterCollectionFormat | undefined;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").StringFormat & import("swagger-schema-official").BaseSchema & {
    in: "query";
    allowEmptyValue?: boolean | undefined;
    collectionFormat?: import("swagger-schema-official").ParameterCollectionFormat | undefined;
}>) & {
    name: string;
    in: string;
} & Record<string, unknown> & {
    in: "path" | "header" | "body" | "query" | "formData";
}], IHttpQueryParam<true>>;
export declare const translateToPathParameter: Oas2TranslateFunction<[param: (import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").GenericFormat & import("swagger-schema-official").BaseSchema & {
    in: "path";
    required: true;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").IntegerFormat & import("swagger-schema-official").BaseSchema & {
    in: "path";
    required: true;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").NumberFormat & import("swagger-schema-official").BaseSchema & {
    in: "path";
    required: true;
}> | import("utility-types/dist/mapped-types")._DeepPartialObject<import("swagger-schema-official").BaseParameter & import("swagger-schema-official").StringFormat & import("swagger-schema-official").BaseSchema & {
    in: "path";
    required: true;
}>) & {
    name: string;
    in: string;
} & Record<string, unknown> & {
    in: "path" | "header" | "body" | "query" | "formData";
}], IHttpPathParam<true>>;
declare type ParameterComponents = Pick<IBundledHttpService['components'], 'query' | 'header' | 'path' | 'cookie' | 'unknownParameters'>;
export declare const translateToSharedParameters: Oas2TranslateFunction<[root: Fragment], ParameterComponents>;
export {};
