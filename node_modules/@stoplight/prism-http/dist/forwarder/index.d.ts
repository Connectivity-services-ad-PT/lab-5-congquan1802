import { IPrismComponents } from '@stoplight/prism-core';
import { IHttpOperation } from '@stoplight/types';
import * as E from 'fp-ts/Either';
import { IHttpConfig, IHttpRequest, IHttpResponse } from '../types';
declare const forward: IPrismComponents<IHttpOperation, IHttpRequest, IHttpResponse, IHttpConfig>['forward'];
export default forward;
export declare function serializeBody(body: unknown): E.Either<Error, string | undefined>;
