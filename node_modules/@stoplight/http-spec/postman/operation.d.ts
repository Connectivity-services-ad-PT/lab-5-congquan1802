import type { IHttpOperation } from '@stoplight/types';
import type { CollectionDefinition } from 'postman-collection';
import type { PostmanCollectionHttpOperationTransformer } from './types';
export declare const transformPostmanCollectionOperations: (document: CollectionDefinition) => IHttpOperation[];
export declare const transformPostmanCollectionOperation: PostmanCollectionHttpOperationTransformer;
