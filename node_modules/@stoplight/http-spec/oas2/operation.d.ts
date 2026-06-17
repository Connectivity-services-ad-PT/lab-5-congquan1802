import type { DeepPartial, IHttpOperation } from '@stoplight/types';
import type { Spec } from 'swagger-schema-official';
import { Oas2HttpOperationTransformer } from '../oas/types';
import { TransformerContext } from '../types';
export declare function transformOas2Operations<T extends DeepPartial<Spec> = DeepPartial<Spec>>(document: T, ctx?: TransformerContext<T>): IHttpOperation[];
export declare const transformOas2Operation: Oas2HttpOperationTransformer;
