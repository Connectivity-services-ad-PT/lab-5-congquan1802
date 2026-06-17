import { IPrismDiagnostic } from '@stoplight/prism-core';
import { DiagnosticSeverity } from '@stoplight/types';
import * as O from 'fp-ts/Option';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { ErrorObject } from 'ajv';
import type { JSONSchema } from '../../';
import { ValidationContext } from './types';
export declare const convertAjvErrors: (errors: NonEmptyArray<ErrorObject>, severity: DiagnosticSeverity, context: ValidationContext, prefix?: string) => NonEmptyArray<IPrismDiagnostic>;
export declare const validateAgainstSchema: (value: unknown, schema: JSONSchema, coerce: boolean, context: ValidationContext, prefix?: string, bundle?: unknown) => O.Option<NonEmptyArray<IPrismDiagnostic>>;
