import { IHttpOperation } from '@stoplight/types';
import { IPrismHttpServer, IPrismHttpServerOpts } from './types';
export declare const createServer: (operations: IHttpOperation[], opts: IPrismHttpServerOpts) => IPrismHttpServer;
