import type { INodeTag, Optional } from '@stoplight/types';
import type { ArrayCallbackParameters, Fragment, TranslateFunction } from '../types';
export declare const translateTagDefinition: TranslateFunction<Fragment, ArrayCallbackParameters<unknown>, Optional<INodeTag>>;
export declare const translateToTags: TranslateFunction<Fragment, [tags: unknown], INodeTag[]>;
