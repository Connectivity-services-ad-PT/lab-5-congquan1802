import { IMediaTypeContent, Optional } from '@stoplight/types';
import { ArrayCallbackParameters } from '../../types';
import type { Oas3TranslateFunction } from '../types';
export declare const translateMediaTypeObject: Oas3TranslateFunction<ArrayCallbackParameters<[mediaType: string, mediaObject: unknown]>, Optional<IMediaTypeContent<true>>>;
