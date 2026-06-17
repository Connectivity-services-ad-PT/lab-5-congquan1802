import { IPrismOutput } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import { IHttpConfig, IHttpRequest, IHttpResponse } from './types';
import * as pino from 'pino';
type IClientConfig = IHttpConfig & {
    baseUrl?: string;
    logger?: pino.Logger;
};
export declare function createClientFromOperations(resources: IHttpOperation[], defaultConfig: IClientConfig): PrismHttp;
type PrismOutput = {
    status: IHttpResponse['statusCode'];
    headers: IHttpResponse['headers'];
    data: unknown;
    config: IClientConfig;
    request: IHttpRequest;
    violations: IPrismOutput<IHttpResponse>['validations'];
};
type RequestFunction = (this: PrismHttp, url: string, input: Omit<IHttpRequest, 'url'>, config?: Partial<IClientConfig>) => Promise<PrismOutput>;
interface IRequestFunctionWithMethod {
    (this: PrismHttp, url: string, input: Required<Pick<IHttpRequest, 'headers'>>, config?: Partial<IClientConfig>): Promise<PrismOutput>;
    (this: PrismHttp, url: string, config?: Partial<IClientConfig>): Promise<PrismOutput>;
}
interface IRequestFunctionWithMethodWithBody {
    (this: PrismHttp, url: string, body: unknown, input: Required<Pick<IHttpRequest, 'headers'>>, config?: Partial<IClientConfig>): Promise<PrismOutput>;
    (this: PrismHttp, url: string, body: unknown, config?: Partial<IClientConfig>): Promise<PrismOutput>;
}
export type PrismHttp = {
    request: RequestFunction;
    get: IRequestFunctionWithMethod;
    put: IRequestFunctionWithMethodWithBody;
    post: IRequestFunctionWithMethodWithBody;
    delete: IRequestFunctionWithMethod;
    options: IRequestFunctionWithMethod;
    head: IRequestFunctionWithMethod;
    patch: IRequestFunctionWithMethodWithBody;
    trace: IRequestFunctionWithMethod;
};
export {};
