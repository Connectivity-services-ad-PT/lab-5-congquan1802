import type { JsonPath, Optional, Reference } from '@stoplight/types';
import type { AvailableContext, References, RefResolver } from '../types';
export declare function inferContext(path: JsonPath): AvailableContext;
export declare function getSharedKey(value: object, currentKey: Optional<string>): any;
export declare function setSharedKey(value: unknown, key: string): false | WeakMap<object, any>;
export declare function getComponentName(references: References, $ref: string): string | undefined;
export declare const resolveRef: RefResolver;
export declare const bundleResolveRef: RefResolver;
export declare function syncReferenceObject<K extends Reference>(reference: K, references: References): K;
