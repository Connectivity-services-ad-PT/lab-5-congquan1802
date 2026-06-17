import type { DeepPartial, IBundledHttpService, IHttpOperationResponse, Optional } from '@stoplight/types';
import type { Operation, Reference } from 'swagger-schema-official';
import { Fragment } from '../../types';
import { Oas2TranslateFunction } from '../types';
export declare const translateToResponse: Oas2TranslateFunction<[produces: string[], statusCode: string, response: unknown], Optional<IHttpOperationResponse<true> | (Pick<IHttpOperationResponse<true>, "code"> & Reference)>>;
export declare const translateToResponses: Oas2TranslateFunction<[
    operation: DeepPartial<Operation>
], NonNullable<ReturnType<typeof translateToResponse>>[]>;
declare type ResponsesComponents = Pick<IBundledHttpService['components'], 'responses'>;
export declare const translateToSharedResponses: Oas2TranslateFunction<[root: Fragment], ResponsesComponents>;
export {};
