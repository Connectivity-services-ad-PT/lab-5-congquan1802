import type { JSONSchema7 } from 'json-schema';
import type { SchemaObject } from 'openapi3-ts/src/model/OpenApi';
import type { Schema } from 'swagger-schema-official';
export declare type OASSchemaObject = SchemaObject | Schema;
export declare type Converter = (schema: OASSchemaObject | JSONSchema7) => void;
