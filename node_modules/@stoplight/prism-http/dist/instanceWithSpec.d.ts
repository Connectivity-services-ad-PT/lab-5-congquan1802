import { IHttpConfig, IHttpRequest, IHttpResponse } from './types';
import type { Logger } from 'pino';
import { IPrismOutput } from '@stoplight/prism-core';
export type PrismOkResult = {
    result: 'ok';
    response: IPrismOutput<IHttpResponse>;
};
export type PrismErrorResult = {
    result: 'error';
    error: Error;
};
export declare function createAndCallPrismInstanceWithSpec(spec: string | object, options: IHttpConfig, request: IHttpRequest, logger: Logger): Promise<PrismErrorResult | PrismOkResult>;
