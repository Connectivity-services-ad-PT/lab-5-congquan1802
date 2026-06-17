import { IPrismDiagnostic } from '@stoplight/prism-core';
import { Dictionary, IHttpEncoding, IMediaTypeContent } from '@stoplight/types';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as NEA from 'fp-ts/NonEmptyArray';
import { JSONSchema } from '../../types';
import { validateFn } from './types';
export declare function deserializeFormBody(schema: JSONSchema, encodings: IHttpEncoding[], decodedUriParams: Dictionary<string>): E.Left<NEA.NonEmptyArray<IPrismDiagnostic>> | E.Right<Dictionary<string, string>>;
export declare function splitUriParams(target: string): E.Either<never, Dictionary<string, string>>;
export declare function parseMultipartFormDataParams(target: string, multipartBoundary?: string): E.Either<NEA.NonEmptyArray<IPrismDiagnostic>, Dictionary<string>>;
export declare function decodeUriEntities(target: Dictionary<string>, mediaType: string): {};
export declare function findContentByMediaTypeOrFirst(specs: IMediaTypeContent[], mediaType: string): O.Option<{
    mediaType: string;
    content: IMediaTypeContent<false>;
}>;
export declare const validate: validateFn<unknown, IMediaTypeContent>;
