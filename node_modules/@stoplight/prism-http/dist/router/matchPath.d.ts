import { MatchType } from './types';
import * as E from 'fp-ts/Either';
export declare function isTemplated(pathFragment: string): boolean;
export declare function matchPath(requestPath: string, operationPath: string): E.Either<Error, MatchType>;
