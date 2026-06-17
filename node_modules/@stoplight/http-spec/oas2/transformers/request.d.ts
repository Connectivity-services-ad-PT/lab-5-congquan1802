import type { IHttpOperationRequest } from '@stoplight/types';
import { Oas2TranslateFunction } from '../types';
export declare const translateToRequest: Oas2TranslateFunction<[
    path: Record<string, unknown>,
    operation: Record<string, unknown>
], IHttpOperationRequest<true>>;
