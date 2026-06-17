import type { Extensions } from '@stoplight/types';
import { Reference } from '@stoplight/types';
import { Fragment, TransformerContext } from '../types';
import { Oas2ParamBase, Oas3ParamBase, OasVersion } from './types';
declare type OasParamsIterator<N> = (this: TransformerContext, path: Fragment, operation: Fragment) => Iterable<N>;
export declare function createOasParamsIterator(spec: OasVersion.OAS2): OasParamsIterator<Oas2ParamBase | Reference>;
export declare function createOasParamsIterator(spec: OasVersion.OAS3): OasParamsIterator<Oas3ParamBase | Reference>;
export declare function getExtensions(target: unknown): Extensions;
export {};
