import { IHttpQueryParam } from '@stoplight/types';
import type { IHttpNameValues } from '../../types';
import { ValidationContext } from './types';
export declare const validate: (target: IHttpNameValues, specs: IHttpQueryParam[], context: ValidationContext, bundle?: unknown) => import("fp-ts/lib/Either").Either<import("fp-ts/lib/NonEmptyArray").NonEmptyArray<import("@stoplight/prism-core").IPrismDiagnostic>, IHttpNameValues>;
