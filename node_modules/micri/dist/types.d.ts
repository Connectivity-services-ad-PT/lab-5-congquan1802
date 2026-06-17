/// <reference types="node" />
import { IncomingMessage, ServerResponse, IncomingHttpHeaders, Server } from 'http';
export declare type MicriHandler<OptsType = any> = (req: IncomingMessage, res: ServerResponse, opts?: OptsType) => any;
export { IncomingMessage, ServerResponse, IncomingHttpHeaders, Server };
export interface IncomingOpts {
    limit?: string | number;
    encoding?: string | null;
}
export interface RawBodyError extends Error {
    limit?: number;
    length?: number;
    expected?: number;
    received?: number;
    encoding?: string;
    status: number;
    statusCode: number;
    type: string;
}
