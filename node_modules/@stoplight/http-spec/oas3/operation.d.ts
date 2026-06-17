import { DeepPartial, IHttpOperation, IHttpWebhookOperation } from '@stoplight/types';
import type { OpenAPIObject } from 'openapi3-ts';
import type { Oas3HttpEndpointOperationTransformer } from '../oas/types';
import { Fragment, TransformerContext } from '../types';
export declare function transformOas3Operations<T extends Fragment = DeepPartial<OpenAPIObject>>(document: T, ctx?: TransformerContext<T>): IHttpOperation[];
export declare function transformOas3WebhookOperations<T extends Fragment = DeepPartial<OpenAPIObject>>(document: T, ctx?: TransformerContext<T>): IHttpWebhookOperation[];
export declare const transformOas3Operation: Oas3HttpEndpointOperationTransformer;
