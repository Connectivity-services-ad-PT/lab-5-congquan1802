import { IHttpOperation } from '@stoplight/types';
export type Nullable<T> = T | null;
export interface IMatch {
    resource: IHttpOperation;
    pathMatch: MatchType;
    methodMatch: MatchType;
    serverMatch?: Nullable<MatchType>;
}
export declare enum MatchType {
    CONCRETE = "concrete",
    TEMPLATED = "templated",
    NOMATCH = "no-match"
}
