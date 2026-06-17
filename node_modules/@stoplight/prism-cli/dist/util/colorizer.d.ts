import { Dictionary } from '@stoplight/types';
export type ValuesTransformer = (values: Dictionary<unknown>) => Dictionary<string | string[] | object>;
export declare const PRE_PARAM_VALUE_TAG = "~pre~";
export declare const POST_PARAM_VALUE_TAG = "~post~";
export declare const transformPathParamsValues: (path: string, transform: (aString: string) => string) => string;
export declare const attachTagsToParamsValues: ValuesTransformer;
