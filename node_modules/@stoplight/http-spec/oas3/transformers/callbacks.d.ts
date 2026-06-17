import type { IHttpCallbackOperation, IHttpKeyedReference } from '@stoplight/types';
import type { Oas3TranslateFunction } from '../types';
export declare const translateToCallbacks: Oas3TranslateFunction<[
    callbacks: unknown
], (IHttpCallbackOperation | IHttpKeyedReference)[] | undefined>;
