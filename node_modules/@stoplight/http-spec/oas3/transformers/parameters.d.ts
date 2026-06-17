import type { IBundledHttpService } from '@stoplight/types';
import { Oas3TranslateFunction } from '../types';
declare type ParameterComponents = Pick<IBundledHttpService['components'], 'query' | 'header' | 'path' | 'cookie' | 'unknownParameters'>;
export declare const translateToSharedParameters: Oas3TranslateFunction<[components: unknown], ParameterComponents>;
export {};
