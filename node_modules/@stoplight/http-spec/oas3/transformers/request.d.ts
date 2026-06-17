import type { IHttpOperationRequest, IHttpOperationRequestBody, IHttpParam, Optional, Reference } from '@stoplight/types';
import type { ParameterObject } from 'openapi3-ts';
import { ArrayCallbackParameters } from '../../types';
import { Oas3TranslateFunction } from '../types';
export declare const translateToSharedRequestBody: Oas3TranslateFunction<ArrayCallbackParameters<[key: string, requestBodyObject: unknown]>, Optional<Reference | IHttpOperationRequestBody<true>>>;
export declare const translateRequestBody: Oas3TranslateFunction<[key: Optional<string>, requestBodyObject: unknown], Optional<Reference | IHttpOperationRequestBody<true>>>;
export declare const translateParameterObject: Oas3TranslateFunction<[parameterObject: ParameterObject], IHttpParam<true>>;
export declare const translateToRequest: Oas3TranslateFunction<[path: Record<string, unknown>, operation: Record<string, unknown>], IHttpOperationRequest<true>>;
