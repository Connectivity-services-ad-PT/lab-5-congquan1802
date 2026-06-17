import { INodeExample } from '@stoplight/types';
import { OpenAPIObject } from 'openapi3-ts';
import { Spec } from 'swagger-schema-official';
import { TranslateFunction } from '../../types';
export declare const translateToDefaultExample: TranslateFunction<import("utility-types/dist/mapped-types")._DeepPartialObject<OpenAPIObject> | import("utility-types/dist/mapped-types")._DeepPartialObject<Spec>, [key: string, value: unknown], INodeExample>;
