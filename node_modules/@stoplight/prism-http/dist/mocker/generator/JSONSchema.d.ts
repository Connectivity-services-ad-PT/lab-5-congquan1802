import { JSONSchema } from '../../types';
import { Either } from 'fp-ts/Either';
import { IHttpContent, IHttpOperation, IHttpParam } from '@stoplight/types';
export declare function resetGenerator(): void;
export declare function generate(resource: IHttpOperation | IHttpParam | IHttpContent, bundle: unknown, source: JSONSchema, seed?: string): Either<Error, unknown>;
export declare function sortSchemaAlphabetically(source: any): any;
export declare function generateStatic(operation: IHttpOperation, source: JSONSchema): Either<Error, unknown>;
export declare class GeneratorError extends Error {
}
export declare class SchemaTooComplexGeneratorError extends GeneratorError {
    readonly cause: Error;
    constructor(operation: IHttpOperation, cause: Error);
}
