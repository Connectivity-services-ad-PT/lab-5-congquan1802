import { IHttpRequest } from '../../../../types';
export declare const none: (input: Pick<IHttpRequest, 'headers' | 'url'>) => import("fp-ts/lib/Either").Either<import("@stoplight/prism-core").IPrismDiagnostic, boolean>;
