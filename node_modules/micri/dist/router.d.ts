/// <reference types="node" />
import { MicriHandler, IncomingMessage, ServerResponse } from './types';
declare type Predicate<OptsType> = (req: IncomingMessage, res: ServerResponse, opts?: OptsType) => boolean;
declare type OnFunction<OptsType> = (pred: Predicate<OptsType>, hndl: MicriHandler<OptsType>) => [Predicate<OptsType>, MicriHandler<OptsType>];
declare const router: <OptsType = any>(...rest: [Predicate<OptsType>, MicriHandler<OptsType>][]) => MicriHandler<OptsType>;
declare const on: {
    [index: string]: OnFunction<any>;
};
declare const otherwise: <OptsType = any>(fn: MicriHandler<OptsType>) => [Predicate<OptsType>, MicriHandler<OptsType>];
declare function everyPredicate<OptsType = any>(...t: Predicate<OptsType>[]): Predicate<OptsType>;
export { Predicate, router, on, otherwise, everyPredicate };
