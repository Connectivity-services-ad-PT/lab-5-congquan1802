import { IHttpOperationConfig, IHttpRequest, ProblemJsonError } from '@stoplight/prism-http';
import * as E from 'fp-ts/Either';
type RequestPreferences = Partial<Omit<IHttpOperationConfig, 'mediaType'>>;
export declare const getHttpConfigFromRequest: (req: Pick<IHttpRequest, 'headers' | 'url'>) => E.Either<ProblemJsonError, RequestPreferences>;
export {};
