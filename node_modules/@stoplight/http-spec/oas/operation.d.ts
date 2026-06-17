import type { DeepPartial, IHttpEndpointOperation } from '@stoplight/types';
import type { OpenAPIObject } from 'openapi3-ts';
import type { Spec } from 'swagger-schema-official';
import type { EndpointOperationConfig, Fragment, HttpEndpointOperationTransformer } from '../types';
import { TransformerContext, TranslateFunction } from '../types';
export declare const OPERATION_CONFIG: EndpointOperationConfig;
export declare const WEBHOOK_CONFIG: EndpointOperationConfig;
export declare function transformOasEndpointOperations<T extends Fragment & DeepPartial<Spec | OpenAPIObject>, TEndpoint extends IHttpEndpointOperation>(document: T, transformer: HttpEndpointOperationTransformer<any, TEndpoint>, config: EndpointOperationConfig, methods?: string[] | null, ctx?: TransformerContext<T>): TEndpoint[];
export declare const transformOasEndpointOperation: TranslateFunction<DeepPartial<OpenAPIObject> | DeepPartial<Spec>, [
    config: EndpointOperationConfig,
    name: string,
    method: string,
    key?: string
], Omit<IHttpEndpointOperation, 'responses' | 'request' | 'servers' | 'security' | 'callbacks'>>;
