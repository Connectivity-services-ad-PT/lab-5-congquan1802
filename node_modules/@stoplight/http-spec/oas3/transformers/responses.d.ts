import type { IHttpOperationResponse, Optional, Reference } from '@stoplight/types';
import { ArrayCallbackParameters } from '../../types';
import { Oas3TranslateFunction } from '../types';
export declare const translateToResponse: Oas3TranslateFunction<ArrayCallbackParameters<[statusCode: string, response: unknown]>, Optional<IHttpOperationResponse<true> | (Pick<IHttpOperationResponse<false>, "code"> & Reference)>>;
export declare const translateToResponses: Oas3TranslateFunction<[
    responses: unknown
], NonNullable<ReturnType<typeof translateToResponse>>[]>;
