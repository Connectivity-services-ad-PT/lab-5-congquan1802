import type { INodeExample, INodeExternalExample, Optional, Reference } from '@stoplight/types';
import type { ArrayCallbackParameters } from '../../types';
import type { Oas3TranslateFunction } from '../types';
export declare const translateToExample: Oas3TranslateFunction<ArrayCallbackParameters<[key: string, example: unknown]>, Optional<INodeExample | INodeExternalExample | ({
    key: string;
} & Reference)>>;
