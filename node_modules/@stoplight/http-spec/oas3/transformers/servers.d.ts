import type { INodeVariable, IServer, Optional } from '@stoplight/types';
import { ArrayCallbackParameters } from '../../types';
import { Oas3TranslateFunction } from '../types';
export declare const translateToServers: Oas3TranslateFunction<[path: Record<string, unknown>, operation: Record<string, unknown>], IServer[]>;
export declare const translateToServer: Oas3TranslateFunction<ArrayCallbackParameters<unknown>, Optional<IServer>>;
export declare const translateServerVariables: Oas3TranslateFunction<[
    variables: unknown
], Optional<Record<string, INodeVariable>>>;
