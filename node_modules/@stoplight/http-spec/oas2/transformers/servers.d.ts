import type { IServer, Optional } from '@stoplight/types';
import { ArrayCallbackParameters } from '../../types';
import type { Oas2TranslateFunction } from '../types';
export declare const translateToServers: Oas2TranslateFunction<[operation: Record<string, unknown>], IServer[]>;
export declare const translateToServer: Oas2TranslateFunction<ArrayCallbackParameters<unknown>, Optional<IServer>>;
