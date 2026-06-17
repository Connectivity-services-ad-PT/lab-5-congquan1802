import { IHttpHeaderParam, Optional, Reference } from '@stoplight/types';
import { Oas3TranslateFunction } from '../types';
export declare const translateHeaderObject: Oas3TranslateFunction<[[name: string, headerObject: unknown]], Optional<IHttpHeaderParam<true> | (Pick<IHttpHeaderParam<true>, "name"> & Reference)>>;
