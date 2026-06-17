import type { Fragment } from '../types';
export declare function createContext<T extends Fragment>(document: T, resolveRef?: import("../types").RefResolver<Fragment>): import("../types").TransformerContext<T>;
