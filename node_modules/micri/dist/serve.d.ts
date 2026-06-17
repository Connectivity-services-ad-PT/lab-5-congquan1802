/// <reference types="node" />
import { IncomingMessage, ServerResponse, Server } from 'http';
import { MicriHandler } from './types';
import { MicriError } from './errors';
export declare function send(res: ServerResponse, statusCode: number, obj?: any): void;
export declare const sendError: (req: IncomingMessage, res: ServerResponse, errorObj: MicriError | Error) => void;
export declare function run<OptsType = any>(req: IncomingMessage, res: ServerResponse, fn: MicriHandler<OptsType>): Promise<void>;
export declare const serve: <OptsType = any>(fn: MicriHandler<OptsType>) => Server;
