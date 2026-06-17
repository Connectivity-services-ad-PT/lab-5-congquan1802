import { IHttpNameValues, JSONSchema } from '../../../types';
export declare function createDelimitedDeserializerStyle(separator: string): (name: string, parameters: IHttpNameValues, schema?: JSONSchema, explode?: boolean) => string[] | "";
