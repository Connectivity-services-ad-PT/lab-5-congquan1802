import type { Fragment, IdGenerator, RefResolver, TransformerContext, TranslateFunction } from './types';
export declare function createContext<T extends Record<string, unknown>>(document: T, resolveRef: RefResolver<T>, generateId: IdGenerator): TransformerContext<T>;
export declare function withContext<F extends TranslateFunction<any, any[]> = TranslateFunction<Fragment, unknown[]>>(fn: F): F;
