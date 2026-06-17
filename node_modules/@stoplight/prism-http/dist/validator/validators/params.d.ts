import { HttpParamStyles, IHttpParam, Dictionary } from '@stoplight/types';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as RE from 'fp-ts/ReaderEither';
import type { deserializeFn } from '../deserializers/types';
import type { IPrismDiagnostic } from '@stoplight/prism-core';
import { ValidationContext } from './types';
export type Deps<Target> = {
    deserializers: Dictionary<deserializeFn<Target>>;
    prefix: string;
    defaultStyle: HttpParamStyles;
};
export declare const validateParams: <Target>(target: Target, specs: IHttpParam[], context: ValidationContext, bundle?: unknown) => RE.ReaderEither<Deps<Target>, NEA.NonEmptyArray<IPrismDiagnostic>, Target>;
