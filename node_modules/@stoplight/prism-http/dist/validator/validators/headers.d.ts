import { IHttpPathParam } from '@stoplight/types';
import { IHttpNameValue } from '../../types';
import { ValidationContext } from './types';
export declare function parseMIMEHeader(contentTypeHeader: string): readonly [string | undefined, string];
export declare const validate: (target: IHttpNameValue, specs: IHttpPathParam[], context: ValidationContext, bundle?: unknown) => import("fp-ts/lib/Either").Either<import("fp-ts/lib/NonEmptyArray").NonEmptyArray<import("@stoplight/prism-core").IPrismDiagnostic>, IHttpNameValue>;
