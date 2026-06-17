import type { Optional } from '@stoplight/types';
import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
import type { OpenAPIObject } from 'openapi3-ts';
import type { Spec } from 'swagger-schema-official';
import type { Fragment, TranslateFunction } from '../../../types';
declare type InternalOptions = {
    structs: string[];
    references: Record<string, {
        resolved: boolean;
        value: string;
    }>;
};
export declare const translateSchemaObject: TranslateFunction<import("utility-types/dist/mapped-types")._DeepPartialObject<OpenAPIObject> | import("utility-types/dist/mapped-types")._DeepPartialObject<Spec> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema7> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema4> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema6>, [schema: unknown], JSONSchema7>;
export declare const translateSchemaObjectFromPair: TranslateFunction<import("utility-types/dist/mapped-types")._DeepPartialObject<OpenAPIObject> | import("utility-types/dist/mapped-types")._DeepPartialObject<Spec> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema7> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema4> | import("utility-types/dist/mapped-types")._DeepPartialObject<JSONSchema6>, [[key: Optional<string>, schema: unknown]], JSONSchema7>;
export declare function convertSchema(document: Fragment, schema: unknown, references?: InternalOptions['references']): JSONSchema7;
export {};
