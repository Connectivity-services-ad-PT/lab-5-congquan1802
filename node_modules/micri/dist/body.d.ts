/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage } from 'http';
import { IncomingOpts } from './types';
export declare function buffer(req: IncomingMessage, { limit }?: IncomingOpts): Promise<Buffer>;
export declare function text(req: IncomingMessage, { limit, encoding }?: IncomingOpts): Promise<string>;
export declare function json(req: IncomingMessage, opts?: IncomingOpts): Promise<any>;
