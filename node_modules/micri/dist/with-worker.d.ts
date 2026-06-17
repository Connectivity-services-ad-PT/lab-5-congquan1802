import { IncomingMessage, ServerResponse } from 'http';
export interface WorkerResponseHeader {
    statusCode: number;
    statusMessage?: string;
    headers: {
        [index: string]: string | string[] | undefined;
    };
}
export default function withWorker<OptsType = any>(handlerPath: string, workerOpts?: {
    eval?: boolean;
    limit?: string;
    env?: {
        [index: string]: string | undefined;
    };
}): (req: IncomingMessage, res: ServerResponse, opts: OptsType) => Promise<void>;
