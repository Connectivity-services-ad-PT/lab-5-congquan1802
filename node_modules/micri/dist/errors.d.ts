import { RawBodyError } from './types';
export declare class MicriError extends Error {
    statusCode: number;
    code: string;
    originalError: Error | null;
    constructor(statusCode: number, code: string, message: string, originalError?: Error);
}
export declare class MicriBodyError extends MicriError {
    constructor(err: RawBodyError, limit: string | number);
}
