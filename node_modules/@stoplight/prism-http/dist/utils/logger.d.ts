import { IPrismDiagnostic } from '@stoplight/prism-core';
import { Logger } from 'pino';
import { RequestInit, Response } from 'node-fetch';
import { IHttpRequest, IHttpResponse } from '../types';
export declare const violationLogger: import("fp-ts/lib/Reader").Reader<Logger, (violation: IPrismDiagnostic) => void>;
type HeadersInput = RequestInit['headers'] | Response['headers'] | IHttpRequest['headers'] | IHttpResponse['headers'];
type BodyInput = RequestInit['body'] | Response['body'] | IHttpRequest['body'] | IHttpResponse['body'];
export declare function logHeaders({ logger, prefix, headers, }: {
    logger: Logger;
    prefix?: string;
    headers: HeadersInput;
}): void;
export declare function logBody({ logger, prefix, body }: {
    logger: Logger;
    prefix?: string;
    body: BodyInput;
}): void;
export declare function logRequest({ logger, prefix, headers, body, }: {
    logger: Logger;
    prefix?: string;
    body?: BodyInput;
    headers?: HeadersInput;
}): void;
export declare function logResponse({ logger, prefix, statusCode, headers, body, }: {
    logger: Logger;
    prefix?: string;
    statusCode: number;
    headers?: HeadersInput;
    body?: BodyInput;
}): void;
export {};
